
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
        p.payout_id,
        p.user_id,
        p.amount,
        p.status,
        p.requested_at,
        p.processed_at,
        p.bank_snapshot,
        p.admin_note,
        u.email,
        up.display_name
      FROM public.affiliate_payouts p
      JOIN users u ON u.user_id = p.user_id
      LEFT JOIN user_profiles up ON up.user_id = p.user_id
      WHERE p.status IN ('pending', 'processing')
      ORDER BY p.requested_at ASC
    `);

    return NextResponse.json(rows);
  } catch (err) {
    console.error("GET /api/admin/affiliates/payouts:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}