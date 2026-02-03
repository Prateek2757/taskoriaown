import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { taskId } = await params;

  try {
    const client = await pool.connect();

    const query = `
      SELECT
        t.task_id,
        t.title,
        t.description,
        t.status,
        t.created_at,
        t.preferred_date_end,
        
        c.category_id,
        c.name AS category_name,
       
        
        u.user_id AS customer_id,
     
        u.email AS customer_email,
        up.profile_image_url AS customer_profile_picture,
        
        up.display_name AS customer_display_name,
        up.phone_number AS customer_phone,
        up.city AS customer_city,
        up.state AS customer_state,
        
        (
          SELECT COUNT(DISTINCT tr.response_id)
          FROM task_responses tr
          WHERE tr.task_id = t.task_id
        ) AS total_responses,
        
        json_agg(
          json_build_object(
            'question_id', ta.category_question_id,
            'question', q.question,
            'answer', ta.answer,
            'question_type', q.question_type
          ) ORDER BY ta.task_answer_id
        ) FILTER (WHERE ta.task_answer_id IS NOT NULL) AS task_answers
        
      FROM tasks t
      JOIN service_categories c ON c.category_id = t.category_id
      JOIN users u ON u.user_id = t.customer_id
      LEFT JOIN user_profiles up ON up.user_id = u.user_id
      LEFT JOIN task_answers ta ON ta.task_id = t.task_id
      LEFT JOIN category_questions q ON q.category_question_id = ta.category_question_id
      
      WHERE t.task_id = $1
        AND t.is_deleted = false
        
      GROUP BY
        t.task_id,
        t.title,
        t.description,
        t.status,
        t.created_at,
        t.preferred_end_date,
        c.category_id,
        c.name,
        u.user_id,
        u.phone_number,
        u.email,
        up.profile_image_url,
        up.display_name,
       
        
    `;

    const result = await client.query(query, [taskId]);
    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ task: result.rows[0] });
  } catch (err) {
    console.error("Fetch task details error:", err);
    return NextResponse.json(
      { error: "Failed to load task details" },
      { status: 500 }
    );
  }
}
