import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const client = await pool.connect();

    const query = `
      SELECT
        tr.response_id,
        tr.message AS response_message,
        tr.credits_spent,
        tr.created_at AS response_created_at,
        t.task_id,
        t.title,
        t.description,
        t.status,
        t.created_at AS task_created_at,
        t.estimated_budget,
        c.category_id,
        c.name AS category_name,
        u.user_id AS customer_id,
        up.display_name AS customer_name,
        up.profile_image_url AS customer_profile_picture,
        (
          SELECT COUNT(DISTINCT tr2.response_id)
          FROM task_responses tr2
          WHERE tr2.task_id = t.task_id
        ) AS total_responses,
        json_agg(
          json_build_object(
            'question_id', ta.category_question_id,
            'question', q.question,
            'answer', ta.answer
          )
        ) FILTER (WHERE ta.task_answer_id IS NOT NULL) AS task_answers
      FROM task_responses tr
      JOIN tasks t ON t.task_id = tr.task_id
      JOIN service_categories c ON c.category_id = t.category_id
      JOIN users u ON u.user_id = t.customer_id
      LEFT JOIN user_profiles up ON up.user_id = t.customer_id
      LEFT JOIN task_answers ta ON ta.task_id = t.task_id
      LEFT JOIN category_questions q ON q.category_question_id = ta.category_question_id
      WHERE tr.professional_id = $1
        AND t.is_deleted = false
      GROUP BY
        tr.response_id,
        tr.message,
        tr.credits_spent,
        tr.created_at,
        t.task_id,
        t.title,
        t.description,
        t.status,
        t.created_at,
        t.estimated_budget,
        c.category_id,
        c.name,
        u.user_id,
        up.display_name ,
        up.profile_image_url 
      ORDER BY tr.created_at DESC;
    `;

    const result = await client.query(query, [userId]);
    client.release();

    return NextResponse.json({ responses: result.rows });
  } catch (err) {
    console.error("Fetch provider responses error:", err);
    return NextResponse.json(
      { error: "Failed to load responses" },
      { status: 500 },
    );
  }
}
