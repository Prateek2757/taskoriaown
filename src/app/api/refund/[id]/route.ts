// src/app/api/refund/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = await pool.connect();
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden. Admin access required." }, { status: 403 });
    }

    const adminId   = session.user.id;
    const refundId  = params.id;
    const body      = await req.json();
    const { status, admin_notes } = body;

    if (!["approved", "rejected", "under_review"].includes(status)) {
      return NextResponse.json(
        { message: "Status must be one of: approved, rejected, under_review." },
        { status: 400 }
      );
    }

    await client.query("BEGIN");

    // ── 1. Fetch the refund request (lock row) ──────────────────────────────
    const refundResult = await client.query(
      `SELECT id, status, professional_id, credits_to_refund, response_id
       FROM refund_requests
       WHERE id = $1
       FOR UPDATE`,
      [refundId]
    );

    if (refundResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json({ message: "Refund request not found." }, { status: 404 });
    }

    const refund = refundResult.rows[0];

    // ── 2. Prevent re-processing already terminal states ────────────────────
    if (["approved", "rejected"].includes(refund.status)) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { message: `Cannot update a refund that has already been ${refund.status}.` },
        { status: 409 }
      );
    }

    // ── 3. Update refund status ──────────────────────────────────────────────
    await client.query(
      `UPDATE refund_requests
       SET status      = $1,
           admin_notes = $2,
           reviewed_by = $3,
           reviewed_at = NOW()
       WHERE id = $4`,
      [status, admin_notes || null, adminId, refundId]
    );

    // ── 4. If approved → credit the professional's account ──────────────────
    if (status === "approved" && refund.credits_to_refund > 0) {
      // Add credits back to user's balance
      await client.query(
        `UPDATE users
         SET credits = COALESCE(credits, 0) + $1
         WHERE user_id = $2`,
        [refund.credits_to_refund, refund.professional_id]
      );

      // Optionally zero out the credits_spent on the response (audit trail)
      await client.query(
        `UPDATE task_responses
         SET credits_refunded = $1,
             updated_at       = NOW()
         WHERE response_id = $2`,
        [refund.credits_to_refund, refund.response_id]
      );
    }

    await client.query("COMMIT");

    return NextResponse.json({
      message: `Refund request ${status} successfully.`,
      refundId,
      status,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("[PATCH /api/refund/:id]", error);
    return NextResponse.json(
      { message: "Internal server error. Please try again later." },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const userId  = session.user.id;
    const isAdmin = session.user.role === "admin";

    const { rows } = await pool.query(
      `SELECT
          rr.*,
          t.title           AS task_title,
          t.description     AS task_description,
          tr.message        AS response_message,
          tr.credits_spent,
          u.email           AS professional_email,
          up.display_name   AS professional_name,
          up.profile_image_url AS professional_avatar,
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
       JOIN tasks           t   ON rr.task_id        = t.task_id
       JOIN task_responses  tr  ON rr.response_id    = tr.response_id
       JOIN users           u   ON rr.professional_id = u.user_id
       LEFT JOIN user_profiles up ON up.user_id      = u.user_id
       LEFT JOIN refund_attachments ra ON ra.refund_id = rr.id
       WHERE rr.id = $1
         AND ($2 OR rr.professional_id = $3)
       GROUP BY rr.id, t.title, t.description,
                tr.message, tr.credits_spent,
                u.email, up.display_name, up.profile_image_url`,
      [id, isAdmin, userId]
    );

    if (rows.length === 0) {
      return NextResponse.json({ message: "Refund request not found." }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("[GET /api/refund/:id]", error);
    return NextResponse.json(
      { message: "Failed to fetch refund request." },
      { status: 500 }
    );
  }
}
