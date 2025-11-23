import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(req: Request) {
  const client = await pool.connect();

  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const {
      title,
      description,
      category_id,
      budget_min,
      budget_max,
      city_id,
      preferred_date_start,
      preferred_date_end,

      category_answers, 
    } = await req.json();

    await client.query("BEGIN");

    const taskResult = await client.query(
      `
      INSERT INTO tasks (
        customer_id,
        category_id,
        title,
        description,
        budget_min,
        budget_max,
        location_id,
        preferred_date_start,
        preferred_date_end,
        
        status
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'Open')
      RETURNING *;
      `,
      [
        session.user.id,
        category_id,
        title,
        description,
        budget_min || null,
        budget_max || null,
        city_id || null,
        preferred_date_start || null,
        preferred_date_end || null,
      ]
    );

    const taskId = taskResult.rows[0].task_id;

    // 2️⃣ Insert category question answers
    if (category_answers && typeof category_answers === "object") {
      const insertAnswerQuery = `
        INSERT INTO task_answers (task_id, category_question_id, answer)
        VALUES ($1, $2, $3)
      `;

      for (const [questionId, answer] of Object.entries(category_answers)) {
        await client.query(insertAnswerQuery, [
          taskId,
          questionId,
          String(answer),
        ]);
      }
    }

    await client.query("COMMIT");

    return NextResponse.json({ success: true, task: taskResult.rows[0] });
  } catch (err: any) {
    await client.query("ROLLBACK");
    console.error("Task creation error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function GET() {
  const client = await pool.connect();

  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // 1️⃣ Get all provider's category_ids
    const { rows: categoryRows } = await client.query(
      `SELECT category_id FROM user_categories WHERE user_id = $1`,
      [userId]
    );

    if (!categoryRows.length) {
      return NextResponse.json(
        { message: "No categories found for this user." },
        { status: 404 }
      );
    }

    // ✅ Extract all category IDs into an array
    const categoryIds = categoryRows.map((r) => r.category_id);

    // 2️⃣ Fetch leads matching any of these categories
    const result = await client.query(
      `
      SELECT 
        t.task_id,
        t.title,
        t.description,
        t.is_remote_allowed,
        t.budget_min,
        t.budget_max,
        t.status,
        t.created_at,
        c.name AS category_name,
        ci.name AS location_name,
        u.email AS customer_email,
        u.phone,
         up.user_id ,
        up.display_name AS customer_name,
        up.profile_image_url as image,
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
        t.status IN ('Open', 'Urgent','In Progress')
        AND t.category_id = ANY($1::int[])   -- ✅ match any category
        AND t.customer_id <> $2
      GROUP BY 
        t.task_id, c.name, ci.name, up.user_id ,u.email, u.phone, up.display_name , up.profile_image_url
      ORDER BY 
        t.created_at DESC;
      `,
      [categoryIds, userId]
    );

    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("Leads fetch error:", err);
    return NextResponse.json(
      { message: "Failed to fetch leads" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
