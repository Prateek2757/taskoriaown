import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";

export async function GET() {
  try {
    const query = `
      SELECT 
        user_profile_id,
        display_name,
        is_provider,
        provider_verified,
        created_at,
        avg_rating,
        total_reviews
      FROM user_profiles
      WHERE is_provider = false
      ORDER BY created_at DESC;
    `;

    const { rows } = await pool.query(query);
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("Database error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}