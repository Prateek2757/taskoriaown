import { NextResponse } from "next/server";
import { getCategoriesFromDB } from "@/lib/cache";


export async function GET() {
  try {
    const rows = await getCategoriesFromDB();

    return NextResponse.json(rows, {
      headers: {
        
        "Cache-Control": "public, s-maxage=604800, stale-while-revalidate=86400",
      },
    });
  } catch (err) {
    console.error("Error fetching categories:", err);
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Unknown error" }, { status: 500 });
  }
}