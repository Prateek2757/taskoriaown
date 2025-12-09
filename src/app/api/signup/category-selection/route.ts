// import { NextRequest, NextResponse } from "next/server";
// import pool from "@/lib/dbConnect";

// export async function POST(req: NextRequest) {
//   try {
//     const { user_id, category_id } = await req.json();

//     if (!user_id || !category_id) {
//       return NextResponse.json({ message: "Missing fields" }, { status: 400 });
//     }

//     // Update user_profiles table
//     const result = await pool.query(
//       `
//       INSERT INTO user_profiles (user_id)
//       VALUES ($1)
//       ON CONFLICT (user_id) DO NOTHING
//       RETURNING user_profile_id
//       `,
//       [user_id]
//     );

//     // Optionally, link category (if you have a user_categories table)
//     await pool.query(
//       `UPDATE user_profiles SET updated_at = NOW() WHERE user_id=$1`,
//       [user_id]
//     );

//     return NextResponse.json({ message: "Category saved", profile_id: result.rows[0]?.user_profile_id });
//   } catch (err: unknown) {
//     if (err instanceof Error)
//       return NextResponse.json({ message: err.message }, { status: 500 });
//     return NextResponse.json({ message: "Unknown error" }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        category_id, 
        name, 
        public_id,
        slug, main_category,
        faqs,
        rank
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