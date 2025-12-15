import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";

export async function GET(req: Request ,context:{params:Promise<{slug:string}>} ) {
  try {
    const slug = (await context.params).slug
    
    if (!slug) {
      return NextResponse.json({ message: "Missing slug" }, { status: 400 });
    }

    const result = await pool.query(
      "SELECT category_id, name,main_category, description,faqs,slug FROM service_categories WHERE slug = $1",
      [slug]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(null, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Unknown error" }, { status: 500 });
  }
}