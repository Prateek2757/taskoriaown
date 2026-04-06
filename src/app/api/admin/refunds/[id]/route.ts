import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/dbConnect";

const VALID_STATUSES = ["approved", "rejected"] as const;

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = await pool.connect();

  try {
    // ── Validate ID ───────────────────────────────────────
    const id = parseInt(params.id, 10);
    if (isNaN(id) || id <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid request ID." },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { status, admin_note } = body;

    // ── Validate status ───────────────────────────────────
    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { success: false, message: `status must be one of: ${VALID_STATUSES.join(", ")}.` },
        { status: 400 }
      );
    }

    // ── Check request exists and is still pending ─────────
    const existing = await client.query<{ status: string }>(
      `SELECT status FROM refund_requests WHERE id = $1`,
      [id]
    );

    if (existing.rowCount === 0) {
      return NextResponse.json(
        { success: false, message: `Request #${id} not found.` },
        { status: 404 }
      );
    }

    if (existing.rows[0].status !== "pending") {
      return NextResponse.json(
        {
          success: false,
          message: `Request #${id} has already been ${existing.rows[0].status}. Only pending requests can be actioned.`,
        },
        { status: 409 }
      );
    }

    // ── Update ────────────────────────────────────────────
    await client.query("BEGIN");

    const { rows } = await client.query(
      `UPDATE refund_requests
       SET status     = $1,
           admin_note = $2,
           updated_at = NOW()
       WHERE id = $3
       RETURNING id, status, admin_note, updated_at`,
      [status, admin_note?.trim() || null, id]
    );

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      message: `Request #${id} has been ${status}.`,
      request: rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("[PATCH /api/admin/refunds/:id]", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}