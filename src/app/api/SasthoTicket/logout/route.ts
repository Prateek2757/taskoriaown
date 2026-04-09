import { NextRequest, NextResponse } from "next/server";
import { decode } from "next-auth/jwt";
import { blacklistToken, purgeExpiredTokens } from "../tokenBlacklistLogout/tokenblacklistlogout";

/**
 * POST /api/auth/logout
 *
 * Invalidates the supplied JWT so it can never be used again,
 * even before its natural expiry.
 *
 * Body (JSON):  { "token": "<jwt>" }   — OR —
 * Header:       Authorization: Bearer <jwt>
 */
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") ?? "";
    const bearerToken = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : null;

    let bodyToken: string | null = null;
    try {
      const body = await req.json();
      bodyToken = typeof body?.token === "string" ? body.token : null;
    } catch {
    }

    const token = bearerToken ?? bodyToken;

    if (!token) {
      return NextResponse.json(
        { error: "Token is required to log out" },
        { status: 400 }
      );
    }

    const decoded = await decode({
      token,
      secret: process.env.NEXTAUTH_SECRET!,
    });


    if (!decoded) {
      return NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
    }

    const expiresAt = decoded.exp
      ? new Date(Number(decoded.exp) * 1000)
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); 

    await blacklistToken(token, expiresAt);

    purgeExpiredTokens().catch(() => {
    });

    return NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
  } catch (err) {
    console.error("[auth/logout]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}