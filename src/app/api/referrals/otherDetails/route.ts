import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { rows } = await pool.query(
      `
      SELECT
        r.referral_id,
        r.referrer_id,
        r.referred_user_id,
        r.referral_code_used,
        r.status,
        r.reward_amount,
        r.created_at,
        r.rewarded_at,
        u.email                  AS referred_email,
        up.display_name          AS referred_display_name,
        up.profile_image_url     AS referred_profile_image_url
      FROM referrals r
      JOIN users u
        ON u.user_id = r.referred_user_id
       AND u.is_deleted = false
      LEFT JOIN user_profiles up
        ON up.user_id = r.referred_user_id
      WHERE r.referrer_id = $1
      ORDER BY r.created_at DESC
      `,
      [userId]
    );

    // ── Summary stats (computed server-side, handy for dashboard cards) ──
    const total          = rows.length;
    const rewarded_count = rows.filter((r) => r.status === "rewarded").length;
    const completed_count = rows.filter((r) => r.status === "completed").length;
    const total_earned   = rows.reduce(
      (sum: number, r) => sum + parseFloat(r.reward_amount ?? 0),
      0
    );

    return NextResponse.json({
      referrals: rows,
      summary: {
        total,
        rewarded_count,
        completed_count,
        total_earned: parseFloat(total_earned.toFixed(2)),
      },
    });
  } catch (error) {
    console.error("GET /api/referrals error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}