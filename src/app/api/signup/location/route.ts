import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";

const SEARCH_LIMIT = 30;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim() ?? "";
    const requestedLimit = Number(searchParams.get("limit"));
    const limit = Number.isFinite(requestedLimit)
      ? Math.min(Math.max(requestedLimit, 1), 100)
      : SEARCH_LIMIT;

    const result = await pool.query(
      `
        SELECT
          al.id::integer AS australia_location_id,
          al.id::text AS place_id,
          al.place_name AS city,
          al.place_name AS suburb,
          al.place_name AS name,
          al.state_name AS state,
          al.state_code,
          al.postal_code AS postcode,
          'Australia'::text AS country,
          al.latitude AS lat,
          al.longitude AS lng,
          al.display_name,
          al.place_slug,
          al.state_slug,
          c.city_id
        FROM australia_locations al
        LEFT JOIN cities c
          ON c.place_id = 'australia_locations:' || al.id::text
        WHERE al.is_active = true
          AND (
            $1 = '' OR
            al.place_name ILIKE '%' || $1 || '%' OR
            al.postal_code LIKE $1 || '%' OR
            al.state_name ILIKE '%' || $1 || '%' OR
            al.state_code ILIKE $1 || '%' OR
            al.display_name ILIKE '%' || $1 || '%'
          )
        ORDER BY
          CASE
            WHEN lower(al.place_name) = lower($1) THEN 0
            WHEN lower(al.postal_code) = lower($1) THEN 1
            WHEN lower(al.place_name) LIKE lower($1) || '%' THEN 2
            ELSE 3
          END,
          al.place_name,
          al.state_code,
          al.postal_code
        LIMIT $2
      `,
      [query, limit]
    );

    return NextResponse.json(result.rows, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const client = await pool.connect();

  try {
    const body = await req.json();
    const locationId = Number(
      body.australia_location_id ?? body.place_id ?? body.id
    );

    if (!Number.isSafeInteger(locationId) || locationId <= 0) {
      return NextResponse.json(
        { error: "A valid Australia location is required" },
        { status: 400 }
      );
    }

    await client.query("BEGIN");
    const locationResult = await client.query(
      `SELECT * FROM australia_locations
       WHERE id = $1 AND is_active = true LIMIT 1`,
      [locationId]
    );
    const location = locationResult.rows[0];

    if (!location) {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "Location not found" }, { status: 404 });
    }

    const countryResult = await client.query(`
      INSERT INTO countries (name) VALUES ('Australia')
      ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
      RETURNING country_id
    `);
    const countryId = countryResult.rows[0].country_id;

    let stateId: number | null = null;
    if (location.state_name) {
      const stateResult = await client.query(
        `INSERT INTO states (name, country_id) VALUES ($1, $2)
         ON CONFLICT (name, country_id) DO UPDATE SET name = EXCLUDED.name
         RETURNING state_id`,
        [location.state_name, countryId]
      );
      stateId = stateResult.rows[0].state_id;
    }

    // cities.display_name is unique. Including postcode keeps same-name
    // localities distinct and prevents one selection from rewriting another.
    const internalDisplayName = [
      location.place_name,
      location.postal_code,
      location.state_code,
      "Australia",
    ]
      .filter(Boolean)
      .join(", ");

    const cityResult = await client.query(
      `
        INSERT INTO cities (
          name, country_id, state_id, latitude, longitude, postcode,
          place_id, display_name, source, slug
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'geonames', $9)
        ON CONFLICT (display_name) DO UPDATE SET
          latitude = EXCLUDED.latitude,
          longitude = EXCLUDED.longitude,
          postcode = EXCLUDED.postcode,
          place_id = EXCLUDED.place_id,
          source = EXCLUDED.source,
          slug = COALESCE(cities.slug, EXCLUDED.slug)
        RETURNING city_id
      `,
      [
        location.place_name,
        countryId,
        stateId,
        location.latitude,
        location.longitude,
        location.postal_code,
        `australia_locations:${location.id}`,
        internalDisplayName,
        location.place_slug,
      ]
    );

    await client.query("COMMIT");
    return NextResponse.json({
      message: "Location resolved successfully",
      country_id: countryId,
      state_id: stateId,
      city_id: cityResult.rows[0].city_id,
      australia_location_id: location.id,
      city: location.place_name,
      display_name: location.display_name,
    });
  } catch (err: unknown) {
    await client.query("ROLLBACK");
    console.error("Error resolving Australia location:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
