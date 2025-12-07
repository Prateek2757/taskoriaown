import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";

export async function GET(
  req: Request,
   context : { params: Promise<{ category_id: string }> }
) {
  try {
    const categoryId =   parseInt((await context.params).category_id, 10);
    if (isNaN(categoryId)) {
      return NextResponse.json(
        { message: "Invalid category_id" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `
      SELECT 
        category_question_id,
        question,
        field_type,
        options,
        is_required,
        sort_order
      FROM category_questions
      WHERE category_id = $1
      ORDER BY sort_order ASC;
      `,
      [categoryId]
    );

    // Always return an array, even if empty
    return NextResponse.json(result.rows);
  } catch (err: any) {
    console.error("Error fetching category questions:", err);
    return NextResponse.json(
      { message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}