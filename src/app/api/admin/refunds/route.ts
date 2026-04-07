import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/dbConnect";

const VALID_STATUSES = ["pending", "approved", "rejected"] as const;
const VALID_ISSUE_TYPES = ["credit_return", "something_else"] as const;

export async function GET(req: NextRequest) {
  const client = await pool.connect();

  try {
    const { searchParams } = new URL(req.url);

    // const search = searchParams.get("search")?.trim() ?? "";
    // const status = searchParams.get("status") ?? "";
    // const issue_type = searchParams.get("issue_type") ?? "";
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "15", 10)));
    const offset = (page - 1) * limit;

    // if (status && !VALID_STATUSES.includes(status as typeof VALID_STATUSES[number])) {
    //   return NextResponse.json(
    //     { success: false, message: "Invalid status filter." },
    //     { status: 400 }
    //   );
    // }

    // if (issue_type && !VALID_ISSUE_TYPES.includes(issue_type as typeof VALID_ISSUE_TYPES[number])) {
    //   return NextResponse.json(
    //     { success: false, message: "Invalid issue_type filter." },
    //     { status: 400 }
    //   );
    // }

    const conditions: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    // if (search) {
    //   conditions.push(
    //     `(email ILIKE $${idx} OR lead_name ILIKE $${idx} OR subject ILIKE $${idx})`
    //   );
    //   values.push(`%${search}%`);
    //   idx++;
    // }

    // if (status) {
    //   conditions.push(`status = $${idx}`);
    //   values.push(status);
    //   idx++;
    // }

    // if (issue_type) {
    //   conditions.push(`issue_type = $${idx}`);
    //   values.push(issue_type);
    //   idx++;
    // }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const countsRes = await client.query<{
      pending: string;
      approved: string;
      rejected: string;
      total: string;
    }>(`
      SELECT
        COUNT(*) FILTER (WHERE status = 'pending')  AS pending,
        COUNT(*) FILTER (WHERE status = 'approved') AS approved,
        COUNT(*) FILTER (WHERE status = 'rejected') AS rejected,
        COUNT(*)                                     AS total
      FROM refund_requests
    `);

    const counts = {
      pending: parseInt(countsRes.rows[0].pending, 10),
      approved: parseInt(countsRes.rows[0].approved, 10),
      rejected: parseInt(countsRes.rows[0].rejected, 10),
      total: parseInt(countsRes.rows[0].total, 10),
    };

    const countRes = await client.query<{ count: string }>(
      `SELECT COUNT(*) AS count FROM refund_requests ${where}`,
      values
    );
    const total = parseInt(countRes.rows[0].count, 10);
    const total_pages = Math.ceil(total / limit) || 1;

    const dataRes = await client.query(
      `SELECT
        id, issue_type, email, lead_name, lead_email,
        reason, support_topic, subject, description,
        status, admin_note, created_at, updated_at
       FROM refund_requests
       ${where}
       ORDER BY
         CASE WHEN status = 'pending' THEN 0 ELSE 1 END,
         created_at DESC
       LIMIT $${idx} OFFSET $${idx + 1}`,
      [...values, limit, offset]
    );

    return NextResponse.json({
      success: true,
      data: dataRes.rows,
      meta: { total, page, limit, total_pages },
      counts,
    });
  } catch (error) {
    console.error("[GET /api/admin/refunds]", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}