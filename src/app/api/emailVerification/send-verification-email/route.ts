import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import pool from "@/lib/dbConnect";
import { authOptions } from "../../auth/[...nextauth]/options";
import { sendEmail } from "@/components/email/helpers/sendVerificationEmail";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" }, 
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Get user details
    const { rows } = await pool.query(
      `SELECT email, is_email_verified FROM users WHERE user_id = $1`,
      [userId]
    );

    if (!rows[0]) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const user = rows[0];

    if (user.is_email_verified) {
      return NextResponse.json(
        { message: "Email already verified" },
        { status: 400 }
      );
    }

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    await pool.query(
      `INSERT INTO email_verification_codes (user_id, code, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '10 minutes')
       ON CONFLICT (user_id) 
       DO UPDATE SET code = $2, expires_at = NOW() + INTERVAL '10 minutes', created_at = NOW()`,
      [userId, verifyCode]
    );

    const emailResult = await sendEmail({
      email: user.email,
      type: "verification",
      username: session.user.name || "User",
      verifyCode,
    });

    if (!emailResult.success) {
      return NextResponse.json(
        { message: "Failed to send verification email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Verification code sent to your email",
    });
  } catch (error) {
    console.error("Send verification email error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}