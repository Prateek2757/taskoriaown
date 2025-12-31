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
      t.*,
  t.task_id,
  t.title,
  t.description,
  t.status,
  t.created_at,
  t.estimated_budget,
  COUNT(DISTINCT r.response_id) AS response_count,
  json_agg(
    json_build_object(
      'question_id', ta.category_question_id,
      'question', q.question,
      'answer', ta.answer
    )
  ) FILTER (WHERE ta.task_answer_id IS NOT NULL) AS answers
FROM tasks t
JOIN service_categories c ON c.category_id = t.category_id
LEFT JOIN task_answers ta ON ta.task_id = t.task_id
LEFT JOIN task_responses r ON r.task_id = t.task_id
LEFT JOIN category_questions q
  ON q.category_question_id = ta.category_question_id
WHERE t.customer_id = $1
  AND t.is_deleted = false
GROUP BY
  t.task_id,
  t.title,
  t.description,
  t.status,
  t.created_at,
  t.estimated_budget
ORDER BY t.created_at DESC;
    `;

    const result = await client.query(query, [userId]);
    client.release();

    return NextResponse.json({ tasks: result.rows });
  } catch (err) {
    console.error("Fetch customer tasks error:", err);
    return NextResponse.json(
      { error: "Failed to load tasks" },
      { status: 500 }
    );
  }
}
