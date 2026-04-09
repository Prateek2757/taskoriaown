import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { createHash } from "crypto";
import pool from "@/lib/dbConnect";

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET!,
      raw: true,  
    });

    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const decoded = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET!,
    });

    if (!decoded?.id) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const tokenHash = createHash("sha256").update(token).digest("hex");
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); 

    await pool.query(
      `INSERT INTO user_sessions (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)
       ON CONFLICT (token_hash) DO UPDATE SET expires_at = $3`,
      [decoded.id, tokenHash, expiresAt]
    );

    return NextResponse.json({ token });

  } catch (err) {
    console.error("[auth/register-session]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}