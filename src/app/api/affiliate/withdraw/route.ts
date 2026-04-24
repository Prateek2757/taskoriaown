import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

const PAYOUT_THRESHOLD = 100;

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId  = session?.user?.id;
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { rows } = await pool.query(
      `SELECT
         p.payout_id   AS id,
         p.amount,
         p.status,
         p.requested_at,
         p.processed_at,
         p.admin_note,
         p.bank_snapshot->>'bankName'                AS bank_name,
         RIGHT(p.bank_snapshot->>'accountNumber', 4)  AS last4,
         COUNT(ac.commission_id)                      AS commission_count
       FROM public.affiliate_payouts p
       LEFT JOIN public.affiliate_commissions ac ON ac.payout_id = p.payout_id
       WHERE p.user_id = $1
       GROUP BY p.payout_id, p.amount, p.status, p.requested_at,
                p.processed_at, p.admin_note, p.bank_snapshot
       ORDER BY p.requested_at DESC`,
      [userId]
    );

    return NextResponse.json(rows);
  } catch (err) {
    console.error("GET /api/affiliate/withdraw:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const client = await pool.connect();
  try {
    const session = await getServerSession(authOptions);
    const userId  = session?.user?.id;
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { amount } = await req.json();
    const withdrawAmount = parseFloat(Number(amount).toFixed(2));

    if (!withdrawAmount || withdrawAmount < PAYOUT_THRESHOLD)
      return NextResponse.json(
        { error: `Minimum withdrawal is $${PAYOUT_THRESHOLD}` },
        { status: 400 }
      );

    await client.query("BEGIN");

    const { rows: balRows } = await client.query(
      `SELECT COALESCE(SUM(commission_amount), 0) AS approved
       FROM public.affiliate_commissions
       WHERE referrer_id = $1 AND status = 'approved'`,
      [userId]
    );
    const approved = parseFloat(parseFloat(balRows[0].approved).toFixed(2));

    if (withdrawAmount > approved) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: `Insufficient approved balance. Available: $${approved.toFixed(2)}` },
        { status: 400 }
      );
    }

    // ── 2. Require bank details ───────────────────────────────────────────────
    const { rows: bankRows } = await client.query(
      `SELECT account_name, bank_name, bsb, account_number, abn
       FROM public.affiliate_bank_details
       WHERE user_id = $1`,
      [userId]
    );

    if (!bankRows.length) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "Please add bank details before withdrawing" },
        { status: 400 }
      );
    }

    // ── 3. Create payout record ───────────────────────────────────────────────
    const { rows: payoutRows } = await client.query(
      `INSERT INTO public.affiliate_payouts
         (user_id, amount, status, bank_snapshot)
       VALUES ($1, $2, 'pending', $3)
       RETURNING payout_id AS id, amount, status, requested_at`,
      [userId, withdrawAmount, JSON.stringify(bankRows[0])]
    );
    const payoutId = payoutRows[0].id;

    // ── 4. FIFO commission allocation with splitting ───────────────────────────
    //
    // Bug fix: the old approach used a running-total WHERE clause which fails
    // when a single commission is LARGER than the withdrawal amount — it marks
    // nothing as paid and the balance never decreases.
    //
    // New approach:
    //   Walk commissions oldest-first in the application layer.
    //   - If commission fits entirely → mark it 'paid', link to payout.
    //   - If commission is larger than remaining → SPLIT the row:
    //       • Shrink the existing row to (amount - consumed).
    //       • Insert a new 'paid' row for the consumed portion linked to payout.
    //   This guarantees the approved balance decreases by exactly withdrawAmount.

    const { rows: commRows } = await client.query(
      `SELECT commission_id, commission_amount,
              referral_id, referred_user_id, subscription_id,
              package_id, payment_transaction_id,
              package_price, commission_rate,
              subscription_month, period_start, period_end
       FROM public.affiliate_commissions
       WHERE referrer_id = $1 AND status = 'approved'
       ORDER BY created_at ASC
       FOR UPDATE`,           // lock rows for this transaction
      [userId]
    );

    let remaining = withdrawAmount;

    for (const row of commRows) {
      if (remaining <= 0) break;

      const commAmount = parseFloat(parseFloat(row.commission_amount).toFixed(2));

      if (commAmount <= remaining) {
        // Entire commission consumed — mark as paid
        await client.query(
          `UPDATE public.affiliate_commissions
           SET status    = 'paid',
               payout_id = $1
           WHERE commission_id = $2`,
          [payoutId, row.commission_id]
        );
        remaining = parseFloat((remaining - commAmount).toFixed(2));
      } else {
        // Commission is larger than remaining withdrawal amount → split it
        //
        // e.g. commission = $399.80, remaining = $100
        //   consumed portion  → $100.00 (new row, status='paid')
        //   leftover portion  → $299.80 (existing row, stays 'approved')

        const consumed = remaining;                                       // $100.00
        const leftover = parseFloat((commAmount - consumed).toFixed(2)); // $299.80

        // Shrink existing commission to the leftover portion (stays 'approved')
        await client.query(
          `UPDATE public.affiliate_commissions
           SET commission_amount = $1
           WHERE commission_id   = $2`,
          [leftover, row.commission_id]
        );

        // Insert a new 'paid' commission row for the consumed portion
        await client.query(
          `INSERT INTO public.affiliate_commissions (
             referral_id, referrer_id, referred_user_id,
             subscription_id, package_id, payment_transaction_id,
             package_price, commission_rate, commission_amount,
             subscription_month, period_start, period_end,
             status, payout_id, admin_note
           )
           SELECT
             referral_id, referrer_id, referred_user_id,
             subscription_id, package_id, payment_transaction_id,
             package_price, commission_rate,
             $1::numeric,        -- consumed amount
             subscription_month, period_start, period_end,
             'paid',             -- status
             $2,                 -- payout_id
             'Split from commission ' || commission_id::text
           FROM public.affiliate_commissions
           WHERE commission_id = $3`,
          [consumed, payoutId, row.commission_id]
        );

        remaining = 0;
        break;
      }
    }

    await client.query("COMMIT");
    return NextResponse.json(payoutRows[0], { status: 201 });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("POST /api/affiliate/withdraw:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    client.release();
  }
}