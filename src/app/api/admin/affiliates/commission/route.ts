// app/api/admin/affiliates/commissions/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/options";

function requireAdmin(session: any) {
  return session?.user?.adminrole === "admin";
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!requireAdmin(session))
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status"); // pending | approved | paid | rejected | all

    const params: any[] = [];
    let whereClause = "";
    if (status && status !== "all") {
      params.push(status);
      whereClause = `WHERE ac.status = $1`;
    }

    const { rows } = await pool.query(
      `SELECT
         ac.commission_id,
         ac.referral_id,
         ac.referrer_id,
         ac.referred_user_id,
         ac.subscription_id,
         ac.package_id,
         ac.payment_transaction_id,
         ac.package_price,
         ac.commission_rate,
         ac.commission_amount,
         ac.subscription_month,
         ac.period_start,
         ac.period_end,
         ac.status,
         ac.approved_at,
         ac.admin_note,
         ac.payout_id,
         ac.created_at,

         -- Referrer info
         u_ref.email              AS referrer_email,
         up_ref.display_name      AS referrer_name,

         -- Referred user info
         u_rfd.email              AS referred_email,
         up_rfd.display_name      AS referred_name,

         -- Package info
         pp.name                  AS package_name,

         -- Referral window
         r.commission_eligible_until,
         r.first_subscribed_at
       FROM public.affiliate_commissions ac
       JOIN public.users u_ref          ON u_ref.user_id  = ac.referrer_id
       JOIN public.users u_rfd          ON u_rfd.user_id  = ac.referred_user_id
       LEFT JOIN public.user_profiles up_ref ON up_ref.user_id = ac.referrer_id
       LEFT JOIN public.user_profiles up_rfd ON up_rfd.user_id = ac.referred_user_id
       JOIN public.professional_packages pp  ON pp.package_id  = ac.package_id
       JOIN public.referrals r               ON r.referral_id  = ac.referral_id
       ${whereClause}
       ORDER BY ac.created_at DESC`,
      params
    );

    return NextResponse.json(rows);
  } catch (err) {
    console.error("GET /api/admin/affiliates/commissions:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── PATCH: approve or reject a commission ────────────────────────────────────
export async function PATCH(req: Request) {
  const client = await pool.connect();
  try {
    const session = await getServerSession(authOptions);
    if (!requireAdmin(session))
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { commissionId, action, adminNote } = await req.json();
    // action: 'approved' | 'rejected'

    if (!commissionId || !["approved", "rejected"].includes(action))
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

    await client.query("BEGIN");

    const { rows } = await client.query(
      `UPDATE public.affiliate_commissions
       SET
         status      = $1,
         approved_at = CASE WHEN $1 = 'approved' THEN NOW() ELSE NULL END,
         approved_by = $2,
         admin_note  = $3
       WHERE commission_id = $4
         AND status = 'pending'
       RETURNING *`,
      [action, session?.user?.id ?? null, adminNote ?? null, commissionId]
    );

    if (!rows.length) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "Commission not found or already processed" },
        { status: 404 }
      );
    }

    await client.query("COMMIT");
    return NextResponse.json(rows[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("PATCH /api/admin/affiliates/commissions:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    client.release();
  }
}