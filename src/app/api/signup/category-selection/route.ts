

import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        category_id, 
        name, 
        image_url,
        public_id,
        slug, main_category,
        faqs,
        rank,
        keywords
      FROM service_categories
      WHERE is_active = true
      ORDER BY rank ASC;
    `);

    return NextResponse.json(result.rows);
    
  } catch (err) {
    console.error("Error fetching categories:", err);
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Unknown error" }, { status: 500 });
  }
}