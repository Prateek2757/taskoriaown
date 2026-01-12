import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function GET() {
  const client = await pool.connect();

  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin (you should have an is_admin or role field)
    const userCheck = await client.query(
      `SELECT role FROM users WHERE user_id = $1`,
      [session.user.id]
    );

    if (!userCheck.rows[0] || userCheck.rows[0].role !== 'admin') {
      return NextResponse.json({ message: "Forbidden: Admin access required" }, { status: 403 });
    }

    // Fetch all tasks without budget or with budget <= 0
    const result = await client.query(
      `
      SELECT 
        t.task_id,
        t.title,
        t.description,
        t.estimated_budget,
        t.status,
        t.created_at,
        t.queries,
        t.preferred_date_start,
        t.preferred_date_end,
        c.name AS category_name,
        ci.name AS location_name,
        ci.postcode,
        u.email AS customer_email,
        u.phone,
        up.display_name AS customer_name,
        up.profile_image_url AS image,
        json_agg(
          json_build_object(
            'question_id', ta.category_question_id,
            'question', q.question,
            'answer', ta.answer
          )
        ) FILTER (WHERE ta.task_answer_id IS NOT NULL) AS answers
      FROM tasks t
      JOIN service_categories c ON c.category_id = t.category_id
      LEFT JOIN cities ci ON ci.city_id = t.location_id
      LEFT JOIN task_answers ta ON ta.task_id = t.task_id
      LEFT JOIN category_questions q ON q.category_question_id = ta.category_question_id
      LEFT JOIN users u ON u.user_id = t.customer_id
      LEFT JOIN user_profiles up ON up.user_id = t.customer_id
      WHERE 
        t.status IN ('Open', 'Urgent')
        AND ( t.estimated_budget <= 0)
      GROUP BY 
        t.task_id, c.name, ci.name, ci.postcode, u.email, u.phone, up.display_name, up.profile_image_url
      ORDER BY 
        t.created_at DESC;
      `
    );

    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("Admin tasks fetch error:", err);
    return NextResponse.json(
      { message: "Failed to fetch tasks without budget" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}