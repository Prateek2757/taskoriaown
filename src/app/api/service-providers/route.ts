import { NextResponse } from "next/server";
import { getServiceProvidersFromDB } from "@/lib/cache";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const serviceSlug = req.nextUrl.searchParams.get("service");
    const citySlug = req.nextUrl.searchParams.get("city");

    if (!serviceSlug || !citySlug) {
      return NextResponse.json(
        { message: "Service and city are required" },
        { status: 400 }
      );
    }

    const rows = await getServiceProvidersFromDB(serviceSlug, citySlug);

    return NextResponse.json(rows, {
      headers: {
        "Cache-Control":
          "public, s-maxage=300, stale-while-revalidate=3600",
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