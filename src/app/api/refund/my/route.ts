import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const professionalId = session.user.id;

    const { rows } = await pool.query(
      `SELECT
          rr.id,
          rr.status,
          rr.reason,
          rr.description,
          rr.credits_to_refund,
          rr.admin_notes,
          rr.created_at,
          rr.reviewed_at,

          t.task_id,
          t.title           AS task_title,

          tr.response_id,
          tr.message        AS response_message,
          tr.credits_spent,

          COALESCE(
            json_agg(
              jsonb_build_object(
                'id',        ra.id,
                'file_url',  ra.file_url,
                'file_name', ra.file_name
              )
            ) FILTER (WHERE ra.id IS NOT NULL),
            '[]'
          ) AS attachments

       FROM refund_requests rr
       JOIN tasks           t  ON rr.task_id     = t.task_id
       JOIN task_responses  tr ON rr.response_id = tr.response_id
       LEFT JOIN refund_attachments ra ON ra.refund_id = rr.id

       WHERE rr.professional_id = $1

       GROUP BY
         rr.id, rr.status, rr.reason, rr.description,
         rr.credits_to_refund, rr.admin_notes, rr.created_at, rr.reviewed_at,
         t.task_id, t.title,
         tr.response_id, tr.message, tr.credits_spent

       ORDER BY rr.created_at DESC`,
      [professionalId]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("[GET /api/refund/my]", error);
    return NextResponse.json(
      { message: "Failed to fetch your refund requests." },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const professionalId = session.user.id;

    // Return tasks with responses that:
    // 1. Have credits_spent > 0
    // 2. Don't already have a refund request
    // 3. Are within the 3-day window
    const { rows } = await pool.query(
      `SELECT
          t.task_id,
          t.title           AS task_title,
          t.description     AS task_description,

          tr.response_id,
          tr.message        AS response_message,
          tr.credits_spent,
          tr.created_at     AS responded_at,

          -- Check if refund already exists
          CASE WHEN rr.id IS NOT NULL THEN true ELSE false END AS has_refund,

          -- Check if within time window (3 days)
          CASE WHEN tr.created_at > NOW() - INTERVAL '3 days' THEN true ELSE false END AS within_window

       FROM task_responses tr
       JOIN tasks t ON tr.task_id = t.task_id
       LEFT JOIN refund_requests rr ON rr.response_id = tr.response_id

       WHERE tr.professional_id      = $1
         AND tr.credits_spent > 0

       ORDER BY tr.created_at DESC
       LIMIT 50`,
      [professionalId]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("[POST /api/refund/my - tasks]", error);
    return NextResponse.json(
      { message: "Failed to fetch your responded tasks." },
      { status: 500 }
    );
  }
}
