import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/dbConnect";

const VALID_ISSUE_TYPES = ["credit_return", "something_else"] as const;
const VALID_REASONS = [
  "invalid_phone",
  "wrong_person_phone",
  "no_response",
  "unwanted_service",
  "duplicate_purchase",
] as const;

export async function POST(req: NextRequest) {
  const client = await pool.connect();

  try {
    const body = await req.json();

    const {
      issue_type,
      email,
      lead_name,
      lead_email,
      reason,
      description,
      subject,
      support_topic,
    } = body;

    if (!issue_type || !VALID_ISSUE_TYPES.includes(issue_type)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing issue_type." },
        { status: 400 }
      );
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: "A valid email address is required." },
        { status: 400 }
      );
    }

    if (issue_type === "credit_return") {
      if (!lead_name?.trim()) {
        return NextResponse.json(
          { success: false, message: "lead_name is required for credit_return." },
          { status: 400 }
        );
      }
      if (!reason) {
        return NextResponse.json(
          { success: false, message: "reason is required for credit_return." },
          { status: 400 }
        );
      }
      if (!VALID_REASONS.includes(reason)) {
        return NextResponse.json(
          { success: false, message: "Invalid reason value." },
          { status: 400 }
        );
      }
    }

    if (issue_type === "something_else") {
      if (!subject?.trim()) {
        return NextResponse.json(
          { success: false, message: "subject is required for something_else." },
          { status: 400 }
        );
      }
      if (!support_topic?.trim()) {
        return NextResponse.json(
          { success: false, message: "support_topic is required for something_else." },
          { status: 400 }
        );
      }
    }

    if (!description?.trim() || description.trim().length < 20) {
      return NextResponse.json(
        { success: false, message: "Description must be at least 20 characters." },
        { status: 400 }
      );
    }

    await client.query("BEGIN");

    const insertQuery = `
      INSERT INTO refund_requests
        (issue_type, email, lead_name, lead_email, reason, description, subject, support_topic)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, status, created_at
    `;

    const { rows } = await client.query(insertQuery, [
      issue_type,
      email,
      lead_name?.trim() || null,
      lead_email?.trim() || null,
      reason || null,
      description.trim(),
      subject?.trim() || null,
      support_topic?.trim() || null,
    ]);

    await client.query("COMMIT");

    return NextResponse.json(
      {
        success: true,
        message: "Request submitted successfully.",
        request: rows[0],
      },
      { status: 201 }
    );
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("[POST /api/refund]", error);
    return NextResponse.json(
      { success: false, message: "Internal server error. Please try again later." },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}