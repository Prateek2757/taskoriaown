
import { NextRequest, NextResponse } from "next/server";
import { decode } from "next-auth/jwt";
import pool from "@/lib/dbConnect";
export const tokenBlacklist = new Set<string>();

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") ?? "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    if (tokenBlacklist.has(token)) {
      return NextResponse.json({ error: "Token has been revoked" }, { status: 401 });
    }

    const decoded = await decode({
      token,
      secret: process.env.NEXTAUTH_SECRET!,
    });

    if (!decoded?.sub) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const userId = decoded.sub;

    const result = await pool.query(
      `
      SELECT 
        u.user_id,
        u.public_id,
        u.email,
        u.phone,
        up.display_name AS name,
        up.profile_image_url AS image
     
      FROM users u
      LEFT JOIN user_profiles up ON u.user_id = up.user_id
      WHERE u.user_id = $1 AND u.is_deleted = FALSE
      `,
      [userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = result.rows[0];

    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone ?? null,
      },
    });
  } catch (err) {
    console.error("[sasto/user]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}