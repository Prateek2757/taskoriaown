import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { professional_id, package_id, payment_method, transaction_ref } = body;

    if (!professional_id || !package_id || !payment_method || !transaction_ref) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const pkgRes = await pool.query(
      "SELECT price, credits FROM credit_packages WHERE package_id = $1",
      [package_id]
    );

    if (pkgRes.rows.length === 0) {
      return NextResponse.json({ error: "Invalid package" }, { status: 404 });
    }

    const { price, credits } = pkgRes.rows[0];

    const insertQuery = `
      INSERT INTO credit_topups (
        professional_id,
        package_id,
        amount,
        credits_added,
        payment_method,
        transaction_ref,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6, 'pending')
      RETURNING *;
    `;

    const values = [
      professional_id,
      package_id,
      price,
      credits,
      payment_method,
      transaction_ref,
    ];

    const { rows } = await pool.query(insertQuery, values);
    return NextResponse.json(rows[0], { status: 201 });
  } catch (error: any) {
    console.error("Top-up error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}