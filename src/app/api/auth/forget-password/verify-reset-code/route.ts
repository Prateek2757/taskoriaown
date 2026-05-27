// app/api/auth/forget-password/verify-reset-code/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/dbConnect";

export async function POST(req: NextRequest) {
  const client = await pool.connect();

  try {
    const { email, code } = await req.json();

    const normalizedEmail = String(email || "").trim().toLowerCase();
    const otp = String(code || "").trim();

    if (!normalizedEmail || !otp) {
      return NextResponse.json(
        { success: false, message: "Email and OTP are required" },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { success: false, message: "Invalid OTP format" },
        { status: 400 }
      );
    }

    const userQuery = await client.query(
      `
      SELECT user_id
      FROM users
      WHERE LOWER(email) = LOWER($1)
        AND reset_password_code = $2
        AND reset_password_expire > NOW()
      LIMIT 1
      `,
      [normalizedEmail, otp]
    );

    if (userQuery.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    await client.query(
      `
      UPDATE users
      SET reset_password_verified = true,
          updated_at = NOW()
      WHERE user_id = $1
      `,
      [userQuery.rows[0].user_id]
    );

    return NextResponse.json(
      { success: true, message: "OTP verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("VERIFY RESET CODE ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to verify OTP" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}