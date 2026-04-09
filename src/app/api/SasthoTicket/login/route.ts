// import { NextRequest, NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import { encode } from "next-auth/jwt";
// import pool from "@/lib/dbConnect";

// const TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { email, phone, password } = body as {
//       email?: string;
//       phone?: string;
//       password?: string;
//     };

//     if (!password || (!email && !phone)) {
//       return NextResponse.json(
//         { error: "Provide (email or phone) and password" },
//         { status: 400 }
//       );
//     }

//     const query = email
//       ? `SELECT
//            u.user_id,
//            u.email,
//            u.phone,
//            u.password_hash,
//            u.is_email_verified,
//            up.display_name AS name
//          FROM users u
//          LEFT JOIN user_profiles up ON u.user_id = up.user_id
//          WHERE u.email = $1 AND u.is_deleted = FALSE`
//       : `SELECT
//            u.user_id,
//            u.email,
//            u.phone,
//            u.password_hash,
//            u.is_email_verified,
//            up.display_name AS name
//          FROM users u
//          LEFT JOIN user_profiles up ON u.user_id = up.user_id
//          WHERE u.phone = $1 AND u.is_deleted = FALSE`;

//     const result = await pool.query(query, [email ?? phone]);

//     const user = result.rows[0] ?? null;
//     const dummyHash =
//       "$2b$10$dummyhashfortimingprotectionXXXXXXXXXXXXXXXXXXXXXXXXXX";
//     const hashToCompare = user?.password_hash ?? dummyHash;
//     const passwordMatch = await bcrypt.compare(password, hashToCompare);

//     if (!user || !passwordMatch) {
//       return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
//     }

//     if (!user.password_hash) {
//       return NextResponse.json(
//         {
//           error: "This account uses social login. Please use the OAuth flow.",
//           code: "OAUTH_ONLY_USER",
//         },
//         { status: 403 }
//       );
//     }

//     const token = await encode({
//       token: {
//         sub: String(user.user_id),
//         name: user.name ?? null,
//         email: user.email ?? null,
//         phone: user.phone ?? null,
//       },
//       secret: process.env.NEXTAUTH_SECRET!,
//       maxAge: TOKEN_MAX_AGE,
//     });

//     return NextResponse.json(
//       {
//         // user: {
//         //   name: user.name ?? null,
//         //   email: user.email ?? null,
//         //   phone: user.phone ?? null,
//         // },
//         token,
//         expiresIn: TOKEN_MAX_AGE,
//       },
//       { status: 200 }
//     );
//   } catch (err) {
//     console.error("[auth/login]", err);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }


// app/api/auth/user/route.ts
import { NextRequest, NextResponse } from "next/server";
import { decode } from "next-auth/jwt";
import { createHash } from "crypto";
import pool from "@/lib/dbConnect";

export async function GET(req: NextRequest) {
  try {
    // ── 1. Get token from header OR ?token= param ────────────────────────────
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

    const tokenHash = createHash("sha256").update(token).digest("hex");
    const sessionRegitsult = await pool.query(
      `SELECT user_id FROM user_sessions
       WHERE token_hash = $1 AND expires_at > NOW()`,
      [tokenHash]
    );

    if (sessionResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // ── 3. Verify NextAuth JWT signature ─────────────────────────────────────
    const decoded = await decode({
      token,
      secret: process.env.NEXTAUTH_SECRET!,
    });

    if (!decoded?.id) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // ── 4. Fetch full user from DB ────────────────────────────────────────────
    const userResult = await pool.query(
      `SELECT
         u.user_id,
         u.public_id,
         u.email,
         u.phone,
         up.display_name  AS name,
         up.profile_image_url AS image,
         COALESCE(r.role_name, 'customer') AS role,
         c.company_name,
         c.slug AS company_slug,
         c.website
       FROM users u
       LEFT JOIN user_profiles up ON u.user_id = up.user_id
       LEFT JOIN roles r ON r.role_id = u.default_role_id
       LEFT JOIN company c ON u.user_id = c.user_id
       WHERE u.user_id = $1 AND u.is_deleted = FALSE`,
      [decoded.id]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = userResult.rows[0];

    return NextResponse.json({
      user: {
        id:           user.public_id,
        name:         user.name ?? null,
        email:        user.email ?? null,
        phone:        user.phone ?? null,
        image:        user.image ?? null,
        role:         user.role,
        company_name: user.company_name ?? null,
        company_slug: user.company_slug ?? null,
        website:      user.website ?? null,
      },
    });

  } catch (err) {
    console.error("[auth/user]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}