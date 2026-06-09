import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import pool from "@/lib/dbConnect";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

const VALID_STATUSES = ["new", "in_progress", "resolved", "archived"] as const;

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.adminrole === "admin" ? session : null;
}

export async function GET(req: NextRequest) {
  const session = await requireAdmin();

  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const client = await pool.connect();

  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));
    const offset = (page - 1) * limit;
    const search = searchParams.get("search")?.trim() ?? "";
    const status = searchParams.get("status")?.trim() ?? "";

    if (status && !VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) {
      return NextResponse.json(
        { success: false, message: "Invalid status filter." },
        { status: 400 }
      );
    }

    const conditions: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (status) {
      conditions.push(`status = $${idx}`);
      values.push(status);
      idx++;
    }

    if (search) {
      conditions.push(
        `(name ILIKE $${idx} OR email ILIKE $${idx} OR subject ILIKE $${idx} OR message ILIKE $${idx})`
      );
      values.push(`%${search}%`);
      idx++;
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const countsRes = await client.query<{
      new: string;
      in_progress: string;
      resolved: string;
      archived: string;
      total: string;
    }>(`
      SELECT
        COUNT(*) FILTER (WHERE status = 'new') AS new,
        COUNT(*) FILTER (WHERE status = 'in_progress') AS in_progress,
        COUNT(*) FILTER (WHERE status = 'resolved') AS resolved,
        COUNT(*) FILTER (WHERE status = 'archived') AS archived,
        COUNT(*) AS total
      FROM contact_submissions
    `);

    const countRes = await client.query<{ count: string }>(
      `SELECT COUNT(*) AS count FROM contact_submissions ${where}`,
      values
    );

    const dataRes = await client.query(
      `
      SELECT
        contact_submission_id,
        name,
        email,
        subject,
        message,
        status,
        admin_note,
        created_at,
        updated_at
      FROM contact_submissions
      ${where}
      ORDER BY
        CASE status
          WHEN 'new' THEN 0
          WHEN 'in_progress' THEN 1
          WHEN 'resolved' THEN 2
          ELSE 3
        END,
        created_at DESC
      LIMIT $${idx} OFFSET $${idx + 1}
      `,
      [...values, limit, offset]
    );

    const total = parseInt(countRes.rows[0].count, 10);

    return NextResponse.json({
      success: true,
      data: dataRes.rows,
      counts: {
        new: parseInt(countsRes.rows[0].new, 10),
        in_progress: parseInt(countsRes.rows[0].in_progress, 10),
        resolved: parseInt(countsRes.rows[0].resolved, 10),
        archived: parseInt(countsRes.rows[0].archived, 10),
        total: parseInt(countsRes.rows[0].total, 10),
      },
      meta: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.error("[GET /api/admin/contact-submissions]", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export async function PATCH(req: Request) {
  const session = await requireAdmin();

  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const client = await pool.connect();

  try {
    const body = await req.json();
    const id = Number(body.contact_submission_id);
    const status = String(body.status ?? "");
    const adminNote = body.admin_note == null ? null : String(body.admin_note);

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid submission id." },
        { status: 400 }
      );
    }

    if (!VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) {
      return NextResponse.json(
        { success: false, message: "Invalid status." },
        { status: 400 }
      );
    }

    const result = await client.query(
      `
      UPDATE contact_submissions
      SET status = $1,
          admin_note = $2,
          updated_at = now()
      WHERE contact_submission_id = $3
      RETURNING contact_submission_id, name, email, subject, message, status, admin_note, created_at, updated_at
      `,
      [status, adminNote, id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, message: "Submission not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("[PATCH /api/admin/contact-submissions]", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
