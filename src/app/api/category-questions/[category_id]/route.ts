import { NextResponse } from "next/server";
import { getCategoryQuestionsFromDB } from "@/lib/cache";

export const revalidate = 21600;

export async function GET(
  _req: Request,
  context: { params: Promise<{ category_id: string }> }
) {
  try {
    const categoryId = parseInt((await context.params).category_id, 10);

    if (isNaN(categoryId)) {
      return NextResponse.json(
        { message: "Invalid category_id" },
        { status: 400 }
      );
    }

    const rows = await getCategoryQuestionsFromDB(categoryId);

    return NextResponse.json(rows, {
      headers: {
        "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400",
      },
    });
  } catch (err: unknown) {
    console.error("Error fetching category questions:", err);
    if (err instanceof Error) {
      return NextResponse.json(
        { message: "Server error", error: err.message },
        { status: 500 }
      );
    }
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}