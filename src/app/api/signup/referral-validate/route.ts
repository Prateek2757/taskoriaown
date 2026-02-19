import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/dbConnect";


export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    if (!code || typeof code !== "string" || code.trim() === "") {
      return NextResponse.json(
        { valid: false, message: "No code provided." },
        { status: 400 }
      );
    }

    const trimmed = code.trim().toUpperCase();

    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT user_id, referral_code FROM users WHERE referral_code = $1 AND is_deleted = FALSE`,
        [trimmed]
      );

      if (result.rowCount === 0) {
        return NextResponse.json(
          { valid: false, message: "Referral code not found." },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { valid: true, message: "Referral code applied! You're good to go 🎉" },
        { status: 200 }
      );
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Referral validate error:", err);
    return NextResponse.json(
      { valid: false, message: "Something went wrong while validating." },
      { status: 500 }
    );
  }
}