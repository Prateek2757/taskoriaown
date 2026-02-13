import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { sendEmail } from "@/components/email/helpers/sendVerificationEmail";
import { createNotification } from "@/lib/notifications";

async function sendEmailsWithRateLimit(emails: any[], ratePerSec: number = 1) {
  const delay = 1000 / ratePerSec;
  for (const emailData of emails) {
    await sendEmail(emailData).catch(console.error);
    await new Promise((res) => setTimeout(res, delay));
  }
}

export async function POST(req: Request) {
  const client = await pool.connect();
  const session = await getServerSession(authOptions);

  try {
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const email = session.user.email;
    const name = session.user.name;

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
      ],
    );

    const taskId = taskResult.rows[0].task_id;

    if (category_answers && typeof category_answers === "object") {
      const insertAnswerQuery = `
        INSERT INTO task_answers (task_id, category_question_id, answer)
        VALUES ($1, $2, $3)
      `;
      for (const [questionId, answer] of Object.entries(category_answers)) {
        let answerToStore =
          Array.isArray(answer) ? JSON.stringify(answer) : answer ?? null;

        await client.query(insertAnswerQuery, [taskId, questionId, answerToStore]);
      }
    }

    const categoryRes = await client.query(
      `SELECT name FROM service_categories WHERE category_id=$1`,
      [category_id],
    );
    const categoryname = categoryRes.rows[0]?.name || "Task";

    // Get admin 
    const adminRes = await client.query(`SELECT email FROM users WHERE role='admin'`);
    const adminEmails = adminRes.rows.map((r) => r.email);

    const providersRes = await client.query(
      `
      SELECT u.email, u.user_id, up.display_name
      FROM user_categories uc
      JOIN users u ON u.user_id = uc.user_id
      LEFT JOIN user_profiles up ON up.user_id = u.user_id
      WHERE uc.category_id = $1
      AND u.user_id <> $2
      `,
      [category_id, session.user.id],
    );

    await client.query("COMMIT");

    const response = NextResponse.json({
      success: true,
      task: taskResult.rows[0],
    });

    const emailQueue: any[] = [];

    if (typeof estimated_budget === "number" && estimated_budget > 0) {
      providersRes.rows.forEach((p) => {
        emailQueue.push({
          email: p.email,
          username: p.display_name || "Provider",
          type: "provider-new-task",
          taskTitle: title,
          taskLocation: categoryname,
        });

        createNotification({
          userId: String(p.user_id),
          type: "task_posted",
          user_name: String(session.user.name),
          title: `${session.user.name} posted a task`,
          body: `New ${categoryname} task available`,
          action_url: "/provider/leads",
        }).catch(console.error);
      });
    } else {
      adminEmails.forEach((adminEmail) => {
        emailQueue.push({
          email: adminEmail,
          username: "Admin",
          type: "task-posted-no-budget",
          taskTitle: categoryname,
        });
      });
    }

    emailQueue.push({
      email,
      username: name,
      type: "task-posted",
      taskTitle: categoryname,
    });

    sendEmailsWithRateLimit(emailQueue, 1).catch(console.error);

    return response;
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
      [userId],
    );

    if (!categoryRows.length) {
      return NextResponse.json(
        { message: "No categories found for this user." },
        { status: 404 },
      );
    }

    const categoryIds = categoryRows.map((r) => r.category_id);

    const result = await client.query(
      `
    WITH new_leads AS (
      SELECT COUNT(DISTINCT t.task_id) AS new_leads_count
      FROM tasks t
      LEFT JOIN user_task_seen uts
        ON uts.task_id = t.task_id
        AND uts.user_id = $2
      WHERE
        t.status IN ('Open', 'Urgent', 'In Progress')
        AND t.category_id = ANY($1::int[])
        AND t.customer_id <> $2
        AND t.estimated_budget IS NOT NULL
        AND t.estimated_budget > 0
        AND COALESCE(uts.seen, false) = false
    )
    
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
    
      (SELECT new_leads_count FROM new_leads) AS new_leads_count,
    
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
      t.status IN ('Open', 'Urgent', 'In Progress')
      AND t.category_id = ANY($1::int[])
      AND t.customer_id <> $2
      AND t.estimated_budget IS NOT NULL
      AND t.estimated_budget > 0
    
    GROUP BY
      t.task_id,
      c.name,
      ci.name,
      ci.latitude,
      ci.longitude,
      ci.postcode,
      up.user_id,
      u.email,
      u.phone,
      up.display_name,
      up.profile_image_url,
      uts.seen
    
    ORDER BY t.created_at DESC;
    `,
      [categoryIds, userId],
    );

    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("Leads fetch error:", err);
    return NextResponse.json(
      { message: "Failed to fetch leads" },
      { status: 500 },
    );
  } finally {
    client.release();
  }
}
