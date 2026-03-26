import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { encode } from "next-auth/jwt";
import pool from "@/lib/dbConnect";

export async function POST(req: NextRequest) {
  try {
    const { email, phone, password } = await req.json();

    if (!password || (!email && !phone)) {
      return NextResponse.json(
        { error: "Provide (email or phone) and password" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `
        SELECT 
          u.user_id,
          u.email,
          u.phone,
          u.password_hash,
          u.is_email_verified
        
        FROM users u
        WHERE u.email = $1 AND u.is_deleted = FALSE
        `,
      [email]
    );

    if (result.rows.length === 0) {
      throw new Error("User not found");
    }

    const user = result.rows[0];

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    if (!user.password_hash) {
      return NextResponse.json(
        {
          error: "This account uses social login. Use the redirect flow.",
          code: "OAUTH_ONLY_USER",
        },
        { status: 403 }
      );
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = await encode({
      token: {
        sub: user.user_id,
        name: user.name,
        email: user.email,
        phone: user.phone ?? null,
      },
      secret: process.env.NEXTAUTH_SECRET!,
      maxAge: 60 * 60 * 24 * 7, 
    });

    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone ?? null,
      },
      token,
    });
  } catch (err) {
    console.error("[sasto/login]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
