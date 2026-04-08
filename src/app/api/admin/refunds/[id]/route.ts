import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import pool from "@/lib/dbConnect";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.adminrole !== "admin") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const id = parseInt ((await context.params).id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ success: false, message: "Invalid request ID" }, { status: 400 });
  }

  let body: { status?: string; admin_note?: string; credit_amount?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 });
  }

  const { status, admin_note, credit_amount } = body;

  if (!status || !["approved", "rejected"].includes(status)) {
    return NextResponse.json(
      { success: false, message: "status must be 'approved' or 'rejected'" },
      { status: 400 }
    );
  }

  try {
    const existing = await pool.query(
      `SELECT id, status, email, issue_type FROM refund_requests WHERE id = $1 LIMIT 1`,
      [id]
    );

    if (existing.rows.length === 0) {
      return NextResponse.json({ success: false, message: "Request not found" }, { status: 404 });
    }

    const request = existing.rows[0];

    if (request.status !== "pending") {
      return NextResponse.json(
        { success: false, message: "Only pending requests can be actioned" },
        { status: 409 }
      );
    }

    await pool.query(
      `UPDATE refund_requests
       SET status = $1, admin_note = $2, updated_at = NOW()
       WHERE id = $3`,
      [status, admin_note ?? null, id]
    );

    let creditsAdded = 0;
    if (
      status === "approved" &&
      request.issue_type === "credit_return" &&
      typeof credit_amount === "number" &&
      credit_amount > 0
    ) {
      const userRes = await pool.query(
        `SELECT user_id FROM users WHERE email = $1 LIMIT 1`,
        [request.email]
      );

      if (userRes.rows.length > 0) {
        const userId: number = userRes.rows[0].user_id;

        const updateRes = await pool.query(
          `UPDATE credit_wallets
           SET total_credits = total_credits + $1, last_updated = NOW()
           WHERE professional_id = $2
           RETURNING total_credits`,
          [credit_amount, userId]
        );

        if (updateRes.rows.length > 0) {
          creditsAdded = credit_amount;
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: { id, status, creditsAdded },
    });
  } catch (err) {
    console.error("[refunds PATCH] DB error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}