import { NextRequest, NextResponse } from "next/server";
import { decode } from "next-auth/jwt";
import pool from "@/lib/dbConnect";
import { isTokenBlacklisted } from "../tokenBlacklistLogout/tokenblacklistlogout";


export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") ?? "";
    const bearerToken = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : null;
    const queryToken = req.nextUrl.searchParams.get("token");
    const token = bearerToken ?? queryToken;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication token is required" },
        { status: 401 }
      );
    }

    const revoked = await isTokenBlacklisted(token);
    if (revoked) {
      return NextResponse.json(
        { error: "Token has been revoked. Please log in again." },
        { status: 401 }
      );
    }

    const decoded = await decode({
      token,
      secret: process.env.NEXTAUTH_SECRET!,
    });

    if (!decoded?.sub) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const result = await pool.query(
      `SELECT
         u.user_id,
         u.public_id,
         u.email,
         u.phone,
         up.display_name  AS name,
         up.profile_image_url AS image
       FROM users u
       LEFT JOIN user_profiles up ON u.user_id = up.user_id
       WHERE u.user_id = $1 AND u.is_deleted = FALSE`,
      [decoded.sub]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = result.rows[0];

    return NextResponse.json(
      {
        user: {
          id: user.public_id,
          name: user.name ?? null,
          email: user.email ?? null,
          phone: user.phone ?? null,
          image: user.image ?? null,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[auth/user]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}