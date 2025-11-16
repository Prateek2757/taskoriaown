import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/dbConnect";

export async function POST(req: NextRequest) {
  try {
    const { user_id, name, email, phone, company_name, website } = await req.json();

    if (!user_id || !email || !name) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    await pool.query(
      `
      UPDATE users 
      SET email=$1, phone=$2, is_deleted=FALSE, updated_at=NOW()
      WHERE user_id=$3
      `,
      [email, phone || null, user_id]
    );

    await pool.query(
      `
      UPDATE user_profiles
      SET display_name=$1, company_name=$2, website=$3, updated_at=NOW()
      WHERE user_id=$4
      `,
      [name, company_name || null, website || null, user_id]
    );

    return NextResponse.json({ message: "Signup details saved" });
  } catch (err: unknown) {
    if (err instanceof Error)
      return NextResponse.json({ message: err.message }, { status: 500 });

    return NextResponse.json({ message: "Unknown error" }, { status: 500 });
  }
}