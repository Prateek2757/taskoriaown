import { query } from "@/lib/clouddb";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type City = {
  city_id: number;
  city_name: string;
  state_code: string | null;
  seo_slug: string | null;
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const search = searchParams.get("search")?.trim() ?? "";
    const requestedLimit = Number(searchParams.get("limit") ?? 50);
    const limit = Math.min(Math.max(requestedLimit, 1), 100);

    const result = await query<City>(
      `
        SELECT
          city_id,
          name,
          seo_slug
        FROM public.cities
        WHERE
          $1 = ''
          OR name ILIKE '%' || $1 || '%'
        ORDER BY name ASC
        LIMIT $2
      `,
      [search, limit],
    );

    return NextResponse.json({
      success: true,
      count: result.rowCount,
      data: result.rows,
    });
  } catch (error) {
    console.error("Failed to fetch cities:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch cities",
      },
      { status: 500 },
    );
  }
}