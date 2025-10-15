import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/dbConnect";

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { message: "User not authenticated" },
        { status: 401 }
      );
    }

    const result = await pool.query(
      `
      SELECT 
        u.user_id,
        u.email,
        u.phone,
        u.is_email_verified,
        u.is_phone_verified,
        up.display_name AS name,
        up.is_onboarded,
        up.is_provider,
        up.provider_verified,
        up.avg_rating,
        up.total_reviews,
        COALESCE(r.role_name, 'customer') AS role
      FROM users u
      LEFT JOIN user_profiles up ON up.user_id = u.user_id
      LEFT JOIN roles r ON r.role_id = u.default_role_id
      WHERE u.user_id = $1 AND u.is_deleted = FALSE
      `,
      [userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: result.rows[0] });
  } catch (err: unknown) {
    if (err instanceof Error)
      return NextResponse.json({ message: err.message }, { status: 500 });
    return NextResponse.json({ message: "Unknown error" }, { status: 500 });
  }
}