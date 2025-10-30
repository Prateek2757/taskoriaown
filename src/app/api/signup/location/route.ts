
import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";


export async function GET() {
  try {
    const result = await pool.query(`
      SELECT city_id, name FROM cities ORDER BY name
    `);
    return NextResponse.json(result.rows);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Unknown error" }, { status: 500 });
  }
}


export async function POST(req: Request) {
  const client = await pool.connect();
  try {
    const body = await req.json();
    const { display_name, city, state, country, postcode, lat,place_id, lon } = body;

    if (!country || !city || !lat || !lon) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await client.query("BEGIN");

    const countryRes = await client.query(
      `
      INSERT INTO countries (name)
      VALUES ($1)
      ON CONFLICT (name) DO NOTHING
      RETURNING country_id;
      `,
      [country]
    );

    const countryId =
      countryRes.rows[0]?.country_id ||
      (
        await client.query(
          `SELECT country_id FROM countries WHERE name = $1`,
          [country]
        )
      ).rows[0].country_id;

   
    let stateId: number | null = null;
    if (state) {
      const stateRes = await client.query(
        `
        INSERT INTO states (name, country_id)
        VALUES ($1, $2)
        ON CONFLICT (name, country_id) DO NOTHING
        RETURNING state_id;
        `,
        [state, countryId]
      );

      stateId =
        stateRes.rows[0]?.state_id ||
        (
          await client.query(
            `SELECT state_id FROM states WHERE name = $1 AND country_id = $2`,
            [state, countryId]
          )
        ).rows[0]?.state_id;
    }

    
    const cityRes = await client.query(
      `
      INSERT INTO cities (name, country_id, state_id, latitude, longitude,place_id , display_name,postcode)
      VALUES ($1, $2, $3, $4, $5 , $6,$7,$8)
      ON CONFLICT (name, state_id, country_id) DO NOTHING
      RETURNING city_id;
      `,
      [city, countryId, stateId, lat, lon, place_id , display_name , postcode]
    );

    const cityId =
      cityRes.rows[0]?.city_id ||
      (
        await client.query(
          `SELECT city_id FROM cities WHERE name = $1 AND state_id = $2 AND country_id = $3`,
          [city, stateId, countryId]
        )
      ).rows[0].city_id;

    await client.query("COMMIT");

    return NextResponse.json({
      message: "Location saved successfully",
      country_id: countryId,
      state_id: stateId,
      city_id: cityId,
    });
  } catch (err: any) {
    await client.query("ROLLBACK");
    console.error("Error saving location:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  } finally {
    client.release();
  }
}
