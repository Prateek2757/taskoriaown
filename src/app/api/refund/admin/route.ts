// src/app/api/refund/admin/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ── Admin role guard ─────────────────────────────────────────────────────
    if (session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden. Admin access required." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status    = searchParams.get("status") || null;
    const dateFrom  = searchParams.get("dateFrom") || null;
    const dateTo    = searchParams.get("dateTo") || null;
    const page      = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit     = Math.min(50, parseInt(searchParams.get("limit") || "20", 10));
    const offset    = (page - 1) * limit;

    // ── Dynamic WHERE clauses ────────────────────────────────────────────────
    const conditions: string[] = [];
    const params: (string | number | null)[] = [];
    let paramIndex = 1;

    if (status) {
      conditions.push(`rr.status = $${paramIndex++}`);
      params.push(status);
    }

    if (dateFrom) {
      conditions.push(`rr.created_at >= $${paramIndex++}::timestamptz`);
      params.push(dateFrom);
    }

    if (dateTo) {
      conditions.push(`rr.created_at <= $${paramIndex++}::timestamptz`);
      params.push(dateTo);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // ── Count query for pagination ───────────────────────────────────────────
    const countResult = await pool.query(
      `SELECT COUNT(*) AS total
       FROM refund_requests rr
       ${whereClause}`,
      params
    );

    const total = parseInt(countResult.rows[0].total, 10);

    // ── Main query with joins ────────────────────────────────────────────────
    const dataParams = [...params, limit, offset];

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

          u.user_id         AS professional_id,
          u.email           AS professional_email,
          up.display_name   AS professional_name,
          up.profile_image_url AS professional_avatar,

          ru.email          AS reviewer_email,

          COALESCE(
            json_agg(
              jsonb_build_object(
                'id',        ra.id,
                'file_url',  ra.file_url,
                'file_name', ra.file_name,
                'mime_type', ra.mime_type
              )
            ) FILTER (WHERE ra.id IS NOT NULL),
            '[]'
          ) AS attachments

       FROM refund_requests rr
       JOIN tasks           t   ON rr.task_id        = t.task_id
       JOIN task_responses  tr  ON rr.response_id    = tr.response_id
       JOIN users           u   ON rr.professional_id = u.user_id
       LEFT JOIN user_profiles up ON up.user_id      = u.user_id
       LEFT JOIN users      ru  ON rr.reviewed_by    = ru.user_id
       LEFT JOIN refund_attachments ra ON ra.refund_id = rr.id

       ${whereClause}

       GROUP BY
         rr.id, rr.status, rr.reason, rr.description,
         rr.credits_to_refund, rr.admin_notes, rr.created_at, rr.reviewed_at,
         t.task_id, t.title, 
         tr.response_id, tr.message, tr.credits_spent,
         u.user_id, u.email, up.display_name, up.profile_image_url,
         ru.email

       ORDER BY rr.created_at DESC
       LIMIT $${paramIndex++} OFFSET $${paramIndex++}`,
      dataParams
    );

    return NextResponse.json({
      data: rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[GET /api/refund/admin]", error);
    return NextResponse.json(
      { message: "Failed to fetch refund requests." },
      { status: 500 }
    );
  }
}
