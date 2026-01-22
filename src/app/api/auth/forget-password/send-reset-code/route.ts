import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/dbConnect";
import { sendEmail } from "@/components/email/helpers/sendVerificationEmail";

function generateResetCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  const client = await pool.connect();

  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const userQuery = await client.query(
      "SELECT u.* ,up.display_name FROM users u LEFT JOIN user_profiles up ON up.user_id = u.user_id WHERE LOWER(email) = LOWER($1)",
      [email.trim()]
    );

    if (userQuery.rows.length === 0) {
      return NextResponse.json(
        { success: true, message: "If account exists, code has been sent" },
        { status: 200 }
      );
    }

    const user = userQuery.rows[0];

    const resetCode = generateResetCode();

    const codeExpiry = new Date(Date.now() + 10 * 60 * 1000); 
    await client.query(
      `UPDATE users 
       SET reset_password_code = $1, 
           reset_password_expire = $2,
           updated_at = NOW()
       WHERE user_id = $3`,
      [resetCode, codeExpiry, user.user_id]
    );

    await sendEmail({
      email: user.email,
      type: "password-reset-code",
      username: user.display_name || user.name,
      verifyCode: resetCode,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Reset code sent to your email",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("SEND RESET CODE ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send reset code" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
