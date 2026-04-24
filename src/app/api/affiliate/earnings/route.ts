// app/api/affiliate/earnings/route.ts
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

    // Commission breakdown by status (from ledger)
    const { rows: commRows } = await pool.query(
      `SELECT
         status,
         COALESCE(SUM(commission_amount), 0) AS total,
         COUNT(*)                             AS count
       FROM public.affiliate_commissions
       WHERE referrer_id = $1
       GROUP BY status`,
      [userId]
    );

    const byStatus: Record<string, number> = {};
    const byCount:  Record<string, number> = {};
    for (const r of commRows) {
      byStatus[r.status] = parseFloat(r.total);
      byCount[r.status]  = parseInt(r.count);
    }

    // Total paid out via processed payouts
    const { rows: paidRows } = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) AS total
       FROM public.affiliate_payouts
       WHERE user_id = $1 AND status = 'paid'`,
      [userId]
    );

    const { rows: refRows } = await pool.query(
      `SELECT
         COUNT(*)                                                        AS total,
         COUNT(*) FILTER (WHERE status = 'pending')                      AS awaiting_subscription,
         COUNT(*) FILTER (WHERE status = 'subscribed'
                            AND commission_eligible_until > NOW())       AS active_earning,
         COUNT(*) FILTER (WHERE status IN ('expired','paid'))            AS completed
       FROM public.referrals
       WHERE referrer_id = $1`,
      [userId]
    );

    const rs = refRows[0];

    const { rows: statusRows } = await pool.query(
      `SELECT status FROM public.affiliate_bank_details WHERE user_id = $1`,
      [userId]
    );

    const nextPayout = new Date();
    nextPayout.setMonth(nextPayout.getMonth() + 1, 1);
    nextPayout.setHours(0, 0, 0, 0);

    return NextResponse.json({
      pending:  byStatus["pending"]  ?? 0,
      approved: byStatus["approved"] ?? 0,
      paid:     parseFloat(paidRows[0].total),

      pendingCount:  byCount["pending"]  ?? 0,
      approvedCount: byCount["approved"] ?? 0,

      referralStats: {
        total:               parseInt(rs.total),
        awaitingSubscription: parseInt(rs.awaiting_subscription),
        activeEarning:       parseInt(rs.active_earning),
        completed:           parseInt(rs.completed),
      },

      commissionRate:  20,
      payoutThreshold: PAYOUT_THRESHOLD,
      nextPayoutDate:  nextPayout.toISOString(),
      affiliateStatus: statusRows[0]?.status ?? "active",
    });
  } catch (err) {
    console.error("GET /api/affiliate/earnings:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}