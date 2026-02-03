import pool from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await pool.query(`SELECT
  c.city_id,
  c.name AS city_name,
  c.slug,
  s.slug AS state_slug,
  c.display_name,
  s.name AS state_name,
  co.name AS country_name
FROM cities c
LEFT JOIN states s ON c.state_id = s.state_id
JOIN countries co ON c.country_id = co.country_id
ORDER BY c.popularity DESC; `);
    return NextResponse.json(result.rows);
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Unknown error" }, { status: 500 });
  }
}
