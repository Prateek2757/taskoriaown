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

    const userCheck = await client.query(
      `SELECT role FROM users WHERE user_id = $1`,
      [session.user.id]
    );

    if (!userCheck.rows[0] || userCheck.rows[0].role !== "admin") {
      return NextResponse.json(
        { message: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    const result = await client.query(
      `
      SELECT
        t.task_id,
        t.public_id,
        t.customer_id,
        t.title,
        t.description,
        t.estimated_budget,
        t.budget_min,
        t.budget_max,
        t.status,
        t.created_at,
        t.updated_at,
        t.queries,
        t.preferred_date_start,
        t.preferred_date_end,
        t.address_line,
        t.is_remote_allowed,
        c.name AS category_name,
        c.image_url AS service_image,
        ci.name AS location_name,
        ci.postcode,
        u.email AS customer_email,
        u.phone,
        up.display_name AS customer_name,
        up.profile_image_url AS image,
        COUNT(DISTINCT tr.response_id)::int AS response_count,
        COALESCE(
          jsonb_agg(
            DISTINCT jsonb_build_object(
              'question_id', ta.category_question_id,
              'question', q.question,
              'answer', ta.answer
            )
          ) FILTER (WHERE ta.task_answer_id IS NOT NULL),
          '[]'::jsonb
        ) AS answers
      FROM tasks t
      JOIN service_categories c ON c.category_id = t.category_id
      LEFT JOIN cities ci ON ci.city_id = t.location_id
      LEFT JOIN task_answers ta ON ta.task_id = t.task_id
      LEFT JOIN category_questions q ON q.category_question_id = ta.category_question_id
      LEFT JOIN task_responses tr ON tr.task_id = t.task_id
      LEFT JOIN users u ON u.user_id = t.customer_id
      LEFT JOIN user_profiles up ON up.user_id = t.customer_id
      WHERE COALESCE(t.is_deleted, false) = false  AND c.is_active = true
      GROUP BY
        t.task_id,
        c.name,
        c.image_url,
        ci.name,
        ci.postcode,
        u.email,
        u.phone,
        up.display_name,
        up.profile_image_url
      ORDER BY t.created_at DESC;
      `
    );

    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("Admin all tasks fetch error:", err);
    return NextResponse.json(
      { message: "Failed to fetch admin tasks" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
