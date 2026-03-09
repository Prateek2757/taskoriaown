import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { rows } = await pool.query(
      `
      SELECT 
        u.user_id,
        u.public_id,
        u.email,
        u.referral_code,
        u.phone,
        u.is_email_verified,
        u.is_phone_verified,
        u.profile_completion,
        u.created_at,
        up.display_name,
        up.profile_image_url
      FROM users u
      LEFT JOIN user_profiles up ON up.user_id = u.user_id
      WHERE u.user_id = $1
        AND u.is_deleted = false
      LIMIT 1
      `,
      [userId]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("GET /api/users/me error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}