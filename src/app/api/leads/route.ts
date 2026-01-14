import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { sendEmail } from "@/components/email/helpers/sendVerificationEmail";

export async function POST(req: Request) {
  const client = await pool.connect();
  const session = await getServerSession(authOptions);

  try {
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let email = session.user?.email;
    const name = session.user?.name;

    const {
      title,
      description,
      category_id,
      estimated_budget,
      city_id,
      preferred_date_start,
      preferred_date_end,
      category_answers,
      queries,
    } = await req.json();

    await client.query("BEGIN");

    const taskResult = await client.query(
      `
      INSERT INTO tasks (
        customer_id,
        category_id,
        title,
        description,
        estimated_budget,
        location_id,
        preferred_date_start,
        preferred_date_end,
        queries,
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
        estimated_budget,
        city_id || null,
        preferred_date_start || null,
        preferred_date_end || null,
        queries,
      ]
    );

    const taskId = taskResult.rows[0].task_id;

    if (category_answers && typeof category_answers === "object") {
      const insertAnswerQuery = `
        INSERT INTO task_answers (task_id, category_question_id, answer)
        VALUES ($1, $2, $3)
      `;

      for (const [questionId, answer] of Object.entries(category_answers)) {
        let answerToStore;
        
        if (Array.isArray(answer)) {
          answerToStore = JSON.stringify(answer);
        } else if (answer === null || answer === undefined) {
          answerToStore = null;
        } else {
          answerToStore = String(answer);
        }

        await client.query(insertAnswerQuery, [
          taskId,
          questionId,
          answerToStore,
        ]);
      }
    }

    const categorynameres = await client.query(
      `SELECT name from service_categories where category_id=$1`,
      [category_id]
    );
    const categoryname = categorynameres.rows[0].name;

    const adminemailres = await client.query(
      `SELECT email from users where role ='admin'`
    );
    const adminEmails = adminemailres.rows.map(r=>r.email);
    console.log(adminEmails);

    await client.query("COMMIT");
      
    const hasBudget =
      typeof estimated_budget === "number" &&
      !isNaN(estimated_budget) &&
      estimated_budget > 0;

    if (!hasBudget) {
      for (const adminEmail of adminEmails) {
        await sendEmail({
          username: "Admin",
          email: adminEmail,
          type: "task-posted-no-budget",
          taskTitle: categoryname,
        });
      }
    }

    await sendEmail({
      username: name,
      email,
      type: "task-posted",
      taskTitle: categoryname,
    });
    const providersRes = await client.query(
      `
      SELECT u.email, up.display_name
      FROM user_categories uc
      JOIN users u ON u.user_id = uc.user_id
      LEFT JOIN user_profiles up ON up.user_id = u.user_id
      WHERE uc.category_id = $1
        
      `,
      [category_id]
    );
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    
    for (const p of providersRes.rows) {
      await sendEmail({
        email: p.email,
        username: p.display_name || "Provider",
        type: "provider-new-task",
        taskTitle: title,
        taskLocation: categoryname,
      });
    
      await delay(600);
    }
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

    const categoryIds = categoryRows.map((r) => r.category_id);

    const result = await client.query(
      `
     SELECT 
    t.task_id,
    t.title,
    t.description,
    t.is_remote_allowed,
    t.budget_min,
    t.budget_max,
    t.estimated_budget,
    t.status,
    t.created_at,
    t.queries,
    c.name AS category_name,
    ci.name AS location_name,
    ci.postcode,
    ci.latitude,
    ci.longitude,
    u.email AS customer_email,
    u.phone,
    up.user_id,
    up.display_name AS customer_name,
    up.profile_image_url AS image,
    COALESCE(uts.seen, false) AS is_seen,  
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
  LEFT JOIN user_task_seen uts 
    ON uts.task_id = t.task_id AND uts.user_id = $2 
  WHERE 
    t.status IN ('Open', 'Urgent','In Progress')
    AND t.category_id = ANY($1::int[])
    AND t.customer_id <> $2
    AND t.estimated_budget IS NOT NULL
    AND t.estimated_budget > 0
  GROUP BY 
    t.task_id, c.name, ci.name,ci.latitude,ci.longitude,ci.postcode, up.user_id, u.email, u.phone, up.display_name, up.profile_image_url, uts.seen
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