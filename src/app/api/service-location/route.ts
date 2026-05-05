import pool from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const stateSlug = searchParams.get("state");
    const citySlug  = searchParams.get("city");

    // ── Single city lookup ──────────────────────────────────────────
    if (citySlug) {
      const result = await pool.query(`
        SELECT
          c.city_id, c.name, c.slug, c.display_name,
          c.popularity, c.latitude, c.longitude, c.image_url,
          c.parent_city_id,
          s.slug  AS state_slug,
          s.name  AS state_name,
          co.name AS country_name
        FROM cities c
        LEFT JOIN states   s  ON c.state_id   = s.state_id
        JOIN      countries co ON c.country_id = co.country_id
        WHERE c.slug = $1
        LIMIT 1
      `, [citySlug]);

      if (!result.rows.length) {
        return NextResponse.json(null);
      }

      const row = result.rows[0];

      // fetch subcities if this is a parent city
      const subResult = await pool.query(`
        SELECT city_id, name, slug, display_name, popularity,
               latitude, longitude, image_url
        FROM cities
        WHERE parent_city_id = $1
        ORDER BY popularity DESC
      `, [row.city_id]);

      return NextResponse.json({
        city_id:      row.city_id,
        name:         row.name,
        slug:         row.slug,
        display_name: row.display_name,
        popularity:   row.popularity,
        latitude:     row.latitude  ? parseFloat(row.latitude)  : null,
        longitude:    row.longitude ? parseFloat(row.longitude) : null,
        image_url:    row.image_url,
        state_slug:   row.state_slug,
        state_name:   row.state_name,
        country_name: row.country_name,
        subcities:    subResult.rows.map((s) => ({
          city_id:      s.city_id,
          name:         s.name,
          slug:         s.slug,
          display_name: s.display_name,
          popularity:   s.popularity,
          latitude:     s.latitude  ? parseFloat(s.latitude)  : null,
          longitude:    s.longitude ? parseFloat(s.longitude) : null,
          image_url:    s.image_url,
        })),
      });
    }

    // ── Cities filtered by state ────────────────────────────────────
    if (stateSlug) {
      const result = await pool.query(`
        SELECT
          c.city_id, c.name, c.slug, c.display_name,
          c.popularity, c.parent_city_id,
          c.latitude, c.longitude, c.image_url,
          s.slug  AS state_slug,
          s.name  AS state_name,
          co.name AS country_name
        FROM cities c
        LEFT JOIN states   s  ON c.state_id   = s.state_id
        JOIN      countries co ON c.country_id = co.country_id
        WHERE s.slug = $1
        ORDER BY c.popularity DESC
      `, [stateSlug]);

      // same parent/subcity grouping logic
      const map = new Map<number, any>();
      const cities: any[] = [];

      for (const row of result.rows) {
        if (!row.parent_city_id) {
          const city = buildCity(row);
          map.set(row.city_id, city);
          cities.push(city);
        }
      }
      for (const row of result.rows) {
        if (row.parent_city_id && map.has(row.parent_city_id)) {
          map.get(row.parent_city_id).subcities.push(buildSubcity(row));
        }
      }

      return NextResponse.json(cities);
    }

    // ── No params — return all (existing behaviour) ─────────────────
    const result = await pool.query(`
      SELECT
        c.city_id, c.name, c.slug, c.display_name,
        c.popularity, c.parent_city_id,
        c.latitude, c.longitude, c.image_url,
        s.slug  AS state_slug,
        s.name  AS state_name,
        co.name AS country_name
      FROM cities c
      LEFT JOIN states   s  ON c.state_id   = s.state_id
      JOIN      countries co ON c.country_id = co.country_id
      ORDER BY c.popularity DESC
    `);

    const map = new Map<number, any>();
    const cities: any[] = [];

    for (const row of result.rows) {
      if (!row.parent_city_id) {
        const city = buildCity(row);
        map.set(row.city_id, city);
        cities.push(city);
      }
    }
    for (const row of result.rows) {
      if (row.parent_city_id && map.has(row.parent_city_id)) {
        map.get(row.parent_city_id).subcities.push(buildSubcity(row));
      }
    }

    return NextResponse.json(cities);

  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// ── Helpers ───────────────────────────────────────────────────────────
function buildCity(row: any) {
  return {
    city_id:      row.city_id,
    name:         row.name,
    slug:         row.slug,
    display_name: row.display_name,
    popularity:   row.popularity,
    latitude:     row.latitude  ? parseFloat(row.latitude)  : null,
    longitude:    row.longitude ? parseFloat(row.longitude) : null,
    image_url:    row.image_url,
    state_slug:   row.state_slug,
    state_name:   row.state_name,
    country_name: row.country_name,
    subcities:    [] as any[],
  };
}

function buildSubcity(row: any) {
  return {
    city_id:      row.city_id,
    name:         row.name,
    slug:         row.slug,
    display_name: row.display_name,
    popularity:   row.popularity,
    latitude:     row.latitude  ? parseFloat(row.latitude)  : null,
    longitude:    row.longitude ? parseFloat(row.longitude) : null,
    image_url:    row.image_url,
  };
}