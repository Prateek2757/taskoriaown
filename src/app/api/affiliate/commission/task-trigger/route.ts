import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";

const CREDIT_TO_DOLLAR = 3;
const COMMISSION_RATE  = 20;
const INTERNAL_SECRET  = process.env.AFFILIATE_WEBHOOK_SECRET ?? "";

export async function POST(req: Request) {
//   const secret = req.headers.get("x-affiliate-secret");
//   if (INTERNAL_SECRET && secret !== INTERNAL_SECRET) {
//     return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//   }

  const client = await pool.connect();
  try {
    const { responseId } = await req.json();

    if (!responseId)
      return NextResponse.json({ error: "responseId required" }, { status: 400 });

    await client.query("BEGIN");

    // ── 1. Load response → get task_id + customer_id via tasks JOIN ────────
    const { rows: respRows } = await client.query(
      `SELECT
         tr.response_id,
         tr.task_id,
         tr.professional_id,
         tr.credits_spent,
         t.customer_id AS customer_id
       FROM public.task_responses tr
       JOIN public.tasks t ON t.task_id = tr.task_id
       WHERE tr.response_id = $1`,
      [responseId]
    );

    if (!respRows.length) {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "Task response not found" }, { status: 404 });
    }

    const resp = respRows[0];

    if (!resp.credits_spent || resp.credits_spent <= 0) {
      await client.query("ROLLBACK");
      return NextResponse.json({
        skipped: true,
        reason: "No credits spent on this response",
      });
    }

    // ── 2. Check if the customer who posted the task was referred ──────────
    //       No referred_user_type filter — a referred user can be both
    //       a professional (subscribes) and a customer (posts tasks).
    //       We simply check: did this user_id join through a referral?
    const { rows: refRows } = await client.query(
      `SELECT
         r.referral_id,
         r.referrer_id,
         r.referred_user_id,
         r.status AS referral_status
       FROM public.referrals r
       WHERE r.referred_user_id = $1
         AND r.status NOT IN ('rejected', 'expired')
       ORDER BY r.created_at DESC
       LIMIT 1`,
      [resp.professional_id]
    );

    if (!refRows.length) {
      await client.query("ROLLBACK");
      return NextResponse.json({
        skipped: true,
        reason: "Task customer did not join via a referral",
      });
    }

    const referral = refRows[0];

    // ── 3. Sum ALL credits on this task fresh from task_responses ──────────
    const { rows: totalsRows } = await client.query(
      `SELECT
         COUNT(*)                        AS total_responses,
         COALESCE(SUM(credits_spent), 0) AS total_credits
       FROM public.task_responses
       WHERE task_id      = $1
         AND credits_spent > 0`,
      [resp.task_id]
    );

    const totalResponses = Number(totalsRows[0].total_responses);
    const totalCredits   = Number(totalsRows[0].total_credits);

    // ── 4. Formula: total_credits × $3 × 20% ──────────────────────────────
    const creditValue      = parseFloat((totalCredits * CREDIT_TO_DOLLAR).toFixed(2));
    const commissionAmount = parseFloat((creditValue  * COMMISSION_RATE / 100).toFixed(2));

    // ── 5. UPSERT — one row per task, grows with each new response ─────────
    const { rows: commRows } = await client.query(
      `INSERT INTO public.affiliate_commissions (
         commission_type,
         referral_id,
         referrer_id,
         referred_user_id,
         task_id,
         response_id,
         credits_spent,
         total_credits,
         total_responses,
         credit_value,
         commission_rate,
         commission_amount,
         status
       ) VALUES ('task', $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'pending')
       ON CONFLICT (task_id, referral_id)
       WHERE commission_type = 'task'
       DO UPDATE SET
         response_id       = EXCLUDED.response_id,
         credits_spent     = EXCLUDED.credits_spent,
         total_credits     = EXCLUDED.total_credits,
         total_responses   = EXCLUDED.total_responses,
         credit_value      = EXCLUDED.credit_value,
         commission_amount = EXCLUDED.commission_amount,
         -- never claw back an already-approved commission
         status            = CASE
                               WHEN affiliate_commissions.status = 'pending'
                               THEN 'pending'
                               ELSE affiliate_commissions.status
                             END,
         updated_at        = now()
       RETURNING *, (xmax = 0) AS is_new_record`,
      [
        referral.referral_id,
        referral.referrer_id,
        resp.professional_id,
        resp.task_id,
        responseId,
        resp.credits_spent,
        totalCredits,
        totalResponses,
        creditValue,
        COMMISSION_RATE,
        commissionAmount,
      ]
    );

    const commission  = commRows[0];
    const isNewRecord = commission.is_new_record;

    // ── 6. Update referral running total ───────────────────────────────────
    //       INSERT → add full amount + flip referral to active
    //       UPDATE → add only the delta this new response contributed
    if (isNewRecord) {
      await client.query(
        `UPDATE public.referrals
         SET total_commission_earned = total_commission_earned + $1,
             status = CASE
                        WHEN status = 'pending' THEN 'active'
                        ELSE status
                      END
         WHERE referral_id = $2`,
        [commissionAmount, referral.referral_id]
      );
    } else {
      // Previous total was everything except this response's credits
      const prevCredits     = totalCredits - Number(resp.credits_spent);
      const prevCreditValue = parseFloat((prevCredits * CREDIT_TO_DOLLAR).toFixed(2));
      const prevCommission  = parseFloat((prevCreditValue * COMMISSION_RATE / 100).toFixed(2));
      const delta           = parseFloat((commissionAmount - prevCommission).toFixed(2));

      if (delta > 0) {
        await client.query(
          `UPDATE public.referrals
           SET total_commission_earned = total_commission_earned + $1
           WHERE referral_id = $2`,
          [delta, referral.referral_id]
        );
      }
    }

    await client.query("COMMIT");

    return NextResponse.json({
      success:       true,
      is_new_record: isNewRecord,
      commission,
      summary: {
        referrer_id:      referral.referrer_id,
        customer_id:      resp.customer_id,
        task_id:          resp.task_id,
        this_response: {
          response_id:   responseId,
          credits_spent: resp.credits_spent,
        },
        task_totals: {
          total_responses:   totalResponses,
          total_credits:     totalCredits,
          credit_value:      `$${creditValue} AUD`,
          commission_rate:   `${COMMISSION_RATE}%`,
          commission_amount: `$${commissionAmount} AUD`,
          formula: `${totalCredits} credits × $${CREDIT_TO_DOLLAR} × ${COMMISSION_RATE}% = $${commissionAmount}`,
        },
      },
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("POST /api/affiliate/commission/task-trigger:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    client.release();
  }
}