import pool from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await pool.query(`SELECT
  c.city_id,
  c.name,
  c.slug,
  c.display_name,
  c.popularity,
  c.parent_city_id,
  s.slug AS state_slug,
  s.name AS state_name,
  co.name AS country_name
FROM cities c
LEFT JOIN states s ON c.state_id = s.state_id
JOIN countries co ON c.country_id = co.country_id
ORDER BY c.popularity DESC;
`);
    const map = new Map<number, any>();
    const cities: any[] = [];

    for (const row of result.rows) {
      if (!row.parent_city_id) {
        const city = {
          city_id: row.city_id,
          name: row.name,
          slug: row.slug,
          display_name: row.display_name,
          popularity: row.popularity,
          state_slug: row.state_slug,
          state_name: row.state_name,
          country_name: row.country_name,
          subcities: [],
        };

        map.set(row.city_id, city);
        cities.push(city);
      }
    }

    for (const row of result.rows) {
      if (row.parent_city_id && map.has(row.parent_city_id)) {
        map.get(row.parent_city_id).subcities.push({
          city_id: row.city_id,
          name: row.name,
          slug: row.slug,
          display_name: row.display_name,
          popularity: row.popularity,
        });
      }
    }

    return NextResponse.json(cities);
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Unknown error" }, { status: 500 });
  }
}
