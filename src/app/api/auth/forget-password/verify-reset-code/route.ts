import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/dbConnect";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const client = await pool.connect();

  try {
    const { email, code, newPassword } = await req.json();

    if (!email || !code || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Email, code, and password are required" },
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
      `SELECT * FROM users 
       WHERE LOWER(email) = LOWER($1) 
       AND reset_password_code = $2 
       AND reset_password_expire > NOW()`,
      [email.trim(), code.trim()]
    );

    if (userQuery.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired code",
        },
        { status: 400 }
      );
    }

    const user = userQuery.rows[0];

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await client.query(
      `UPDATE users 
       SET password_hash = $1,
           reset_password_code = NULL,
           reset_password_expire = NULL,
           updated_at = NOW()
       WHERE user_id = $2`,
      [hashedPassword, user.user_id]
    );

    return NextResponse.json(
      {
        success: true,
        message: "Password reset successful",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("VERIFY RESET CODE ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to reset password" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}