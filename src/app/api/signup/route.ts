// import { NextRequest, NextResponse } from "next/server";
// import pool from "@/lib/dbConnect";
// import bcrypt from "bcryptjs";

// export async function POST(req: NextRequest) {
//   try {
//     const { username, email, password, serviceCategory } = await req.json();

//     if (!username || !email || !password || !serviceCategory) {
//       return NextResponse.json({ message: "Missing fields" }, { status: 400 });
//     }

//     const existing = await pool.query(
//       "SELECT * FROM users WHERE email=$1 OR username=$2",
//       [email, username]
//     );
//     if (existing.rows.length > 0) {
//       return NextResponse.json({ message: "User already exists" }, { status: 400 });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const result = await pool.query(
//       `INSERT INTO users (username, email, password, role, service_category)
//        VALUES ($1, $2, $3, $4, $5)
//        RETURNING id, username, email, role, service_category`,
//       [username, email, hashedPassword, "provider", serviceCategory]
//     );

//     return NextResponse.json({ message: "User created", user: result.rows[0] }, { status: 201 });
//   } catch (err: unknown) {
//     if (err instanceof Error) return NextResponse.json({ message: err.message }, { status: 500 });
//     return NextResponse.json({ message: "Unknown error" }, { status: 500 });
//   }
// }