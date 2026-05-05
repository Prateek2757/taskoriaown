import { NextResponse } from "next/server";
import { getCategoryBySlug } from "@/lib/cache";

// Revalidate segment-level cache every hour
export const revalidate = 3600;

export async function GET(
  _req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const slug = (await context.params).slug;

    if (!slug) {
      return NextResponse.json({ message: "Missing slug" }, { status: 400 });
    }

    const row = await getCategoryBySlug(slug);

    if (!row) {
      return NextResponse.json(null, { status: 404 });
    }

    return NextResponse.json(row, {
      headers: {
        // Category data rarely changes — cache for 1 hour at CDN + browser.
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Unknown error" }, { status: 500 });
  }
}