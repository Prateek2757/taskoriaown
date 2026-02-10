import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";

export async function GET() {
  try {
    const { rows } = await pool.query(`
      SELECT package_id, name, credits, price, description,stripe_price_id
      FROM credit_packages
      WHERE is_active = true
      ORDER BY price ASC
    `);
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("Error fetching packages:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}