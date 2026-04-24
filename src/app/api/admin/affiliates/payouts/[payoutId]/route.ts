import { payouts } from './../../../../../../lib/mockData';
import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth/[...nextauth]/options";

function requireAdmin(session: any) {
  return session?.user?.adminrole === "admin";
}

export async function GET(
  _req: Request,
  context: { params: Promise<{ payoutId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!requireAdmin(session))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const payoutId = (await context.params).payoutId;
  const { rows } = await pool.query(
    `SELECT p.*, u.email, up.display_name
     FROM public.affiliate_payouts p
     JOIN users u ON u.user_id = p.user_id
     LEFT JOIN user_profiles up ON up.user_id = p.user_id
     WHERE p.payout_id = $1`,
    [payoutId]
  );

  if (!rows.length)
    return NextResponse.json({ error: "Payout not found" }, { status: 404 });

  return NextResponse.json(rows[0]);
}

export async function PATCH(
  req: Request,
 context: { params: Promise<{ payoutId: string }> }
) {
  const client = await pool.connect();
  try {
    const session = await getServerSession(authOptions);
    if (!requireAdmin(session))
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
     const payoutId = (await context.params).payoutId
    const { action, adminNote } = await req.json();

    if (!["paid", "rejected", "processing"].includes(action))
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });

    await client.query("BEGIN");

    const { rows: payoutRows } = await client.query(
      `SELECT * FROM public.affiliate_payouts WHERE payout_id = $1 FOR UPDATE`,
      [payoutId]
    );

    if (!payoutRows.length) {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "Payout not found" }, { status: 404 });
    }

    const payout = payoutRows[0];

    if (!["pending", "processing"].includes(payout.status)) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: `Cannot update payout with status '${payout.status}'` },
        { status: 409 }
      );
    }

    // Update payout status
    const { rows: updated } = await client.query(
      `UPDATE public.affiliate_payouts
       SET status       = $1,
           processed_at = $2,
           admin_note   = $3
       WHERE payout_id  = $4
       RETURNING *`,
      [
        action,
        action === "paid" ? new Date() : null,
        adminNote ?? null,
      payoutId,
      ]
    );

    if (action === "paid") {
      await client.query(
        `UPDATE public.referrals
         SET status      = 'paid',
             rewarded_at = NOW()
         WHERE referrer_id = $1
           AND status IN ('approved', 'processing')`,
        [payout.user_id]
      );
    }

    if (action === "rejected") {
      await client.query(
        `UPDATE public.referrals
         SET status = 'approved'
         WHERE referrer_id = $1
           AND status = 'processing'`,
        [payout.user_id]
      );
    }

    await client.query("COMMIT");
    return NextResponse.json(updated[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("PATCH /api/admin/affiliates/payouts/[payoutId]:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
