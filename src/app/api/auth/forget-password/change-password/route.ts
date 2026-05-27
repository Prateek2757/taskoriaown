// app/api/auth/forget-password/change-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/dbConnect";

export async function POST(req: NextRequest) {
  const client = await pool.connect();

  try {
    const { email, newPassword } = await req.json();

    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!normalizedEmail || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const userQuery = await client.query(
      `
      SELECT user_id
      FROM users
      WHERE LOWER(email) = LOWER($1)
        AND is_deleted = false
        AND status = 'active'
        AND reset_password_verified = true
        AND reset_password_expire > NOW()
      LIMIT 1
      `,
      [normalizedEmail]
    );

    if (userQuery.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "OTP verification required or expired" },
        { status: 403 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await client.query(
      `
      UPDATE users
      SET password_hash = $1,
          reset_password_code = NULL,
          reset_password_expire = NULL,
          reset_password_verified = false,
          updated_at = NOW()
      WHERE user_id = $2
      `,
      [hashedPassword, userQuery.rows[0].user_id]
    );

    return NextResponse.json(
      { success: true, message: "Password changed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("CHANGE PASSWORD ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to change password" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}