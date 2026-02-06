import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import pool from "@/lib/dbConnect";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" }, 
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { fullCode } = await req.json();

    if (!fullCode || fullCode.length !== 6) {
      return NextResponse.json(
        { message: "Invalid verification code" },
        { status: 400 }
      );
    }

    const { rows } = await pool.query(
      `SELECT code, expires_at FROM email_verification_codes 
       WHERE user_id = $1`,
      [userId]
    );

    if (!rows[0]) {
      return NextResponse.json(
        { message: "No verification code found. Please request a new one." },
        { status: 404 }
      );
    }

    const { code: storedCode, expires_at } = rows[0];


    if (new Date(expires_at) < new Date()) {
      await pool.query(
        `DELETE FROM email_verification_codes WHERE user_id = $1`,
        [userId]
      );
      return NextResponse.json(
        { message: "Verification code has expired. Please request a new one." },
        { status: 400 }
      );
    }

    if (storedCode !== fullCode) {
      return NextResponse.json(
        { message: "Invalid verification code" },
        { status: 400 }
      );
    }

    await pool.query(
      `UPDATE users SET is_email_verified = true WHERE user_id = $1`,
      [userId]
    );

    // await pool.query(
    //   `DELETE FROM email_verification_codes WHERE user_id = $1`,
    //   [userId]
    // );

    return NextResponse.json({
      success: true,
      message: "Email verified successfully!",
    });
  } catch (error) {
    console.error("Verify email error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}