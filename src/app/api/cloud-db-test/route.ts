import { query } from "@/lib/clouddb";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type DatabaseInfo = {
  database_name: string;
  database_user: string;
  server_time: Date;
};

export async function GET() {
  try {
    const result = await query<DatabaseInfo>(`
      SELECT
        current_database() AS database_name,
        current_user AS database_user,
        NOW() AS server_time
    `);

    return NextResponse.json({
      success: true,
      connection: result.rows[0],
    });
  } catch (error) {
    console.error("Cloud SQL connection failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Cloud SQL connection failed",
      },
      { status: 500 },
    );
  }
}