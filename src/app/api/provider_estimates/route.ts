import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { sendEmail } from "@/components/email/helpers/sendVerificationEmail";
import { createNotification } from "@/lib/notifications";
import { logActivity } from "@/lib/logactivity";

// ─── POST: submit a new estimate ─────────────────────────────────────────────

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const {
    task_id,
    customer_name,
    task_title,
    price,
    unit,
    message,
    professional_name,
    professional_company_name,
    professional_phone,
  } = await req.json();

  try {
    const client = await pool.connect();

    const { rows } = await client.query(
      `SELECT COUNT(*) FROM provider_estimates WHERE task_id=$1 AND professional_id=$2`,
      [task_id, session.user.id]
    );
    const count = Number(rows[0].count);

    if (count >= 2) {
      client.release();
      return NextResponse.json({ error: "Estimate limit reached" }, { status: 403 });
    }

    const { rows: userRows } = await client.query(
      `SELECT customer_id FROM tasks WHERE task_id=$1`,
      [task_id]
    );
    const customerId = Number(userRows[0].customer_id);

    await client.query(
      `INSERT INTO provider_estimates (task_id, professional_id, price, pricing_type, message)
       VALUES ($1, $2, $3, $4, $5)`,
      [task_id, session.user.id, price, unit, message]
    );

    // ── Log the activity ────────────────────────────────────────────────────
    await logActivity({
      task_id,
      professional_id: session.user.id,
      activity_type: "estimate_sent",
      metadata: {
        price,
        unit,
        message_preview: message?.slice(0, 120),
        professional_name,
      },
    });

    await sendEmail({
      email: "pratikguragain4@gmail.com",
      username: customer_name,
      type: "provider-estimate",
      taskTitle: task_title,
      price,
      unit,
      messageFromProvider: message,
      professional_name,
      professional_company_name,
      professional_phone,
    });

    await createNotification({
      userId: String(customerId),
      role: "customer",
      type: "lead_response",
      title: "New Estimate Received",
      body: `${professional_name} sent you an estimate of A$ ${price} ${unit} for "${task_title}"`,
      user_name: professional_name,
      action_url: `/customer/dashboard`,
    });

    client.release();

    return NextResponse.json({ success: true, remaining: 2 - (count + 1) });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to send estimate" }, { status: 500 });
  }
}

// ─── GET: fetch activities for a task ────────────────────────────────────────

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const task_id = searchParams.get("task_id");

  if (!task_id) {
    return NextResponse.json({ error: "task_id is required" }, { status: 400 });
  }

  try {
    const client = await pool.connect();

    // Fetch all activities (emails + estimates) in one query
    const { rows: activities } = await client.query(
      `SELECT activity_id, activity_type, metadata, created_at
       FROM provider_activities
       WHERE task_id = $1 AND professional_id = $2
       ORDER BY created_at DESC`,
      [task_id, session.user.id]
    );

    client.release();
    return NextResponse.json({ activities });
  } catch (err) {
    console.error("GET /api/provider-estimates error:", err);
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 });
  }
}