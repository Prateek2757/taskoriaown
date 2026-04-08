import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import pool from "@/lib/dbConnect";


export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.adminrole !== "admin") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      { success: false, message: "email query param is required" },
      { status: 400 }
    );
  }

  try {
    const user = await pool.query(
      `SELECT user_id FROM users WHERE email = $1 LIMIT 1`,
      [email]
    );

    if (user.rows.length === 0) {
      return NextResponse.json({
        success: true,
        hasWallet: false,
        message: "No user found with this email.",
      });
    }

    const userId: number = user.rows[0].user_id;

    const wallet = await pool.query(
      `SELECT wallet_id, total_credits FROM credit_wallets WHERE professional_id = $1 LIMIT 1`,
      [userId]
    );

    if (wallet.rows.length === 0) {
      return NextResponse.json({
        success: true,
        hasWallet: false,
        userId,
        message: "User exists but has no credit wallet.",
      });
    }

    return NextResponse.json({
      success: true,
      hasWallet: true,
      currentCredits: wallet.rows[0].total_credits as number,
      userId,
    });
  } catch (err) {
    console.error("[wallet-check] DB error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}