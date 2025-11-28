import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";

export async function GET() {
  try {
    const { rows } = await pool.query(
      `SELECT package_id, name, description, price, duration_months 
       FROM professional_packages 
       ORDER BY price ASC`
    );

    return NextResponse.json({ packages: rows });
  } catch (error) {
    console.error("PACKAGES API ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}