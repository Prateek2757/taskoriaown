import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/options";

function requireAdmin(session: any) {
  return session?.user?.adminrole === "admin";
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!requireAdmin(session))
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { rows } = await pool.query(`
      SELECT
        u.user_id,
        u.email,
        u.referral_code,
        u.created_at                          AS joined_at,
        up.display_name,
        up.profile_image_url,

        -- ── Referral counts ────────────────────────────────────────────────
        COUNT(DISTINCT r.referral_id)          AS total_referrals,

        -- ── Commission earnings from affiliate_commissions ─────────────────
        --    Covers BOTH subscription + task rows via commission_type
        COALESCE(SUM(ac.commission_amount)
          FILTER (WHERE ac.status = 'pending'),   0) AS pending_earnings,

        COALESCE(SUM(ac.commission_amount)
          FILTER (WHERE ac.status = 'approved'),  0) AS approved_earnings,

        COALESCE(SUM(ac.commission_amount)
          FILTER (WHERE ac.status = 'processing'),0) AS processing_earnings,

        -- ── Breakdown by commission type ───────────────────────────────────
        COALESCE(SUM(ac.commission_amount)
          FILTER (WHERE ac.commission_type = 'subscription'
                    AND ac.status = 'approved'), 0) AS approved_subscription_earnings,

        COALESCE(SUM(ac.commission_amount)
          FILTER (WHERE ac.commission_type = 'task'
                    AND ac.status = 'approved'), 0) AS approved_task_earnings,

        -- ── Bank details ───────────────────────────────────────────────────
        abd.account_name,
        abd.bank_name,
        abd.bsb,
        RIGHT(abd.account_number, 4)          AS account_last4,
        abd.abn,
        abd.tax_file_url,
        abd.status                            AS affiliate_status,

        -- ── Payout summary ─────────────────────────────────────────────────
        COALESCE(
          SUM(ap.amount) FILTER (WHERE ap.status = 'paid'), 0
        )                                     AS total_paid_out,

        COUNT(ap.payout_id)
          FILTER (WHERE ap.status = 'pending') AS pending_payout_count

      FROM public.users u
      LEFT JOIN public.user_profiles           up  ON up.user_id   = u.user_id
      -- referrals where THIS user is the referrer
      LEFT JOIN public.referrals               r   ON r.referrer_id = u.user_id
      -- commissions earned by THIS referrer (both types)
      LEFT JOIN public.affiliate_commissions   ac  ON ac.referrer_id = u.user_id
      LEFT JOIN public.affiliate_bank_details  abd ON abd.user_id   = u.user_id
      LEFT JOIN public.affiliate_payouts       ap  ON ap.user_id    = u.user_id

      WHERE u.is_deleted    = false
        AND u.referral_code IS NOT NULL

      GROUP BY
        u.user_id,
        u.email,
        u.referral_code,
        u.created_at,
        up.display_name,
        up.profile_image_url,
        abd.account_name,
        abd.bank_name,
        abd.bsb,
        abd.account_number,
        abd.abn,
        abd.tax_file_url,
        abd.status

      ORDER BY approved_earnings DESC
    `);

    return NextResponse.json(rows);
  } catch (err) {
    console.error("GET /api/admin/affiliates:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}