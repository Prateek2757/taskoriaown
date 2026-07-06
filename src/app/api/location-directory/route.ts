import { NextResponse } from "next/server";
import { getLocationDirectoryByStateFromDB } from "@/lib/cache";
import pool from "@/lib/dbConnect";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const stateSlug = searchParams.get("state");
    if (stateSlug) {
      const rows = await getLocationDirectoryByStateFromDB(stateSlug);

      return NextResponse.json(rows, {
        headers: {
          "Cache-Control":
            "public, s-maxage=86400, stale-while-revalidate=604800",
        },
      });
    }

    const values: string[] = [];

    const result = await pool.query(
      `
      SELECT DISTINCT ON (state_slug, place_slug)
        id::integer AS city_id,
        place_name AS name,
        place_slug AS slug,
        display_name,
        postal_code AS postcode,
        state_slug,
        COALESCE(popularity, 0) AS popularity
      FROM australia_locations
      WHERE is_active = true
        AND place_slug IS NOT NULL
        AND state_slug IS NOT NULL
      ORDER BY
        state_slug,
        place_slug,
        popularity DESC NULLS LAST,
        updated_at DESC
    `,
      values
    );

    result.rows.sort((a, b) =>
      a.name.localeCompare(b.name, "en-AU", { sensitivity: "base" })
    );

    return NextResponse.json(result.rows, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
