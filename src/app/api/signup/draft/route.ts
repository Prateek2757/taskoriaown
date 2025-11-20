import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/dbConnect";

export async function POST(req: NextRequest) {
  try {
    const { role = "provider" } = await req.json();

    const result = await pool.query(
      `
      INSERT INTO users (email, default_role_id, is_deleted)
      VALUES ($1, (SELECT role_id FROM roles WHERE role_name=$2), TRUE)
      RETURNING user_id, public_id, default_role_id
      `,
      [`draft-${Date.now()}@taskoria.local`, role]
    );

    return NextResponse.json({ 
      message: "Draft user created", 
      user: result.rows[0] 
    }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error)
      return NextResponse.json({ message: err.message }, { status: 500 });
    return NextResponse.json({ message: "Unknown error" }, { status: 500 });
  }
}