import { NextResponse } from "next/server";
import { getServiceProvidersFromDB } from "@/lib/cache";

export const revalidate = 300;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const serviceSlug = searchParams.get("service");
    const citySlug = searchParams.get("city");

    if (!serviceSlug || !citySlug) {
      return NextResponse.json(
        { message: "Service and city are required" },
        { status: 400 }
      );
    }

    const rows = await getServiceProvidersFromDB(serviceSlug, citySlug);

    return NextResponse.json(rows, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch providers" },
      { status: 500 }
    );
  }
}