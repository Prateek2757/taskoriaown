// import { NextResponse } from "next/server";
// import pool from "@/lib/dbConnect";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { professional_id, package_id, payment_method, transaction_ref } = body;

//     if (!professional_id || !package_id || !payment_method || !transaction_ref) {
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//     }

//     const pkgRes = await pool.query(
//       "SELECT price, credits FROM credit_packages WHERE package_id = $1",
//       [package_id]
//     );

//     if (pkgRes.rows.length === 0) {
//       return NextResponse.json({ error: "Invalid package" }, { status: 404 });
//     }

//     const { price, credits } = pkgRes.rows[0];

//     const insertQuery = `
//       INSERT INTO credit_topups (
//         professional_id,
//         package_id,
//         amount,
//         credits_added,
//         payment_method,
//         transaction_ref,
//         status
//       )
//       VALUES ($1, $2, $3, $4, $5, $6, 'pending')
//       RETURNING *;
//     `;

//     const values = [
//       professional_id,
//       package_id,
//       price,
//       credits,
//       payment_method,
//       transaction_ref,
//     ];

//     const { rows } = await pool.query(insertQuery, values);
//     return NextResponse.json(rows[0], { status: 201 });
//   } catch (error: any) {
//     console.error("Top-up error:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request: Request) {
  const client = await pool.connect();

  try {
    const body = await request.json();
    const {
      professional_id,
      package_id,
      payment_method,
      transaction_ref,
    } = body;

    if (!professional_id || !package_id || !payment_method) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await client.query("BEGIN");

    const packageResult = await client.query(
      "SELECT * FROM credit_packages WHERE package_id = $1",
      [package_id]
    );

    if (packageResult.rows.length === 0) {
      throw new Error("Package not found");
    }

    const pkg = packageResult.rows[0];

    const topupResult = await client.query(
      `
      INSERT INTO credit_topups (
        professional_id,
        package_id,
        amount,
        credits_added,
        payment_method,
        transaction_ref,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6, 'completed')
      RETURNING topup_id
      `,
      [
        professional_id,
        package_id,
        pkg.price,
        pkg.credits,
        payment_method,
        transaction_ref,
      ]
    );

    const topup_id = topupResult.rows[0].topup_id;

    await client.query(
      `
      INSERT INTO credit_wallets (professional_id, total_credits, last_topup_id)
      VALUES ($1, $2, $3)
      ON CONFLICT (professional_id)
      DO UPDATE SET
        total_credits = credit_wallets.total_credits + EXCLUDED.total_credits,
        last_topup_id = EXCLUDED.last_topup_id,
        last_updated = NOW()
      `,
      [professional_id, pkg.credits, topup_id]
    );

    await client.query(
      `
      INSERT INTO payment_transactions (
        reference_id,
        professional_id,
        transaction_type,
        amount,
        credits_used,
        payment_gateway,
        status,
        remarks
      )
      VALUES ($1, $2, 'topup', $3, 0, $4, 'completed', 'Credit top-up successful')
      `,
      [transaction_ref, professional_id, pkg.price, payment_method]
    );

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      message: "Credit top-up successful",
      topup_id,
      credits_added: pkg.credits,
      amount: pkg.price,
    });
  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("Credit top-up error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process credit top-up" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
