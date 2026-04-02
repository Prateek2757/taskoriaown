import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

const REFUND_WINDOW_DAYS = 3;

const VALID_REASONS = [
  "fake_lead",
  "irrelevant_lead",
  "spam",
  "duplicate_lead",
  "customer_no_show",
  "incorrect_information",
  "technical_error",
  "other",
] as const;

export async function POST(req: NextRequest) {
  const client = await pool.connect();
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const professionalId = session.user.id;
    const body = await req.json();
    const { task_id, response_id, reason, description } = body;

    if (!task_id || !response_id || !reason ) {
      return NextResponse.json(
        { message: "task_id, response_id, reason are required." },
        { status: 400 }
      );
    }

    if (!VALID_REASONS.includes(reason)) {
      return NextResponse.json({ message: "Invalid reason value." }, { status: 400 });
    }

    // if (description.trim().length < 20) {
    //   return NextResponse.json(
    //     { message: "Description must be at least 20 characters." },
    //     { status: 400 }
    //   );
    // }

    await client.query("BEGIN");

    // ── 2. Verify the task_response belongs to this professional ─────────────
    const responseCheck = await client.query(
      `SELECT response_id, credits_spent, created_at
       FROM task_responses
       WHERE response_id = $1
         AND task_id     = $2
         AND professional_id  = $3
       FOR UPDATE`,
      [response_id, task_id, professionalId]
    );

    if (responseCheck.rows.length === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { message: "Response not found or does not belong to you." },
        { status: 404 }
      );
    }

    const { credits_spent, created_at: responseCreatedAt } = responseCheck.rows[0];

    // ── 3. Credits must have been spent ─────────────────────────────────────
    if (!credits_spent || credits_spent <= 0) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { message: "No credits were spent on this response. Refund not applicable." },
        { status: 422 }
      );
    }

    // ── 4. Enforce time window (3 days) ─────────────────────────────────────
    // const responseAge =
    //   (Date.now() - new Date(responseCreatedAt).getTime()) / (1000 * 60 * 60 * 24);

    // if (responseAge > REFUND_WINDOW_DAYS) {
    //   await client.query("ROLLBACK");
    //   return NextResponse.json(
    //     {
    //       message: `Refund window expired. Requests must be submitted within ${REFUND_WINDOW_DAYS} days of responding.`,
    //     },
    //     { status: 422 }
    //   );
    // }

    // ── 5. Prevent duplicate refund per response ─────────────────────────────
    const dupCheck = await client.query(
      `SELECT id FROM refund_requests WHERE response_id = $1`,
      [response_id]
    );

    if (dupCheck.rows.length > 0) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { message: "A refund request already exists for this response." },
        { status: 409 }
      );
    }

    const { rows } = await client.query(
      `INSERT INTO refund_requests
         (task_id, response_id, professional_id, reason, description, credits_to_refund)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, status, created_at`,
      [task_id, response_id, professionalId, reason, description.trim(), credits_spent]
    );

    await client.query("COMMIT");

    return NextResponse.json(
      { message: "Refund request submitted successfully.", refund: rows[0] },
      { status: 201 }
    );
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("[POST /api/refund]", error);
    return NextResponse.json(
      { message: "Internal server error. Please try again later." },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
