import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/dbConnect";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const client = await pool.connect();

  try {
    const {
      user_id,
      category_id,
      is_nationwide,
      location_id,
      name,
      email,
      phone,
      password,
    } = await req.json();

    if (!user_id || !category_id || !name || !email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await client.query("BEGIN");

    // Add category
    await client.query(
      `INSERT INTO user_categories (user_id, category_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [user_id, category_id]
    );

    // Add or update profile
    await client.query(
      `
      INSERT INTO user_profiles (user_id, display_name, location_id, is_nationwide, is_onboarded)
      VALUES ($1, $2, $3, $4, TRUE)
      ON CONFLICT (user_id)
      DO UPDATE SET
        display_name = $2,
        location_id = $3,
        is_nationwide = $4,
        is_onboarded = TRUE,
        updated_at = NOW()
      `,
      [user_id, name, is_nationwide ? null : location_id || null, is_nationwide]
    );

    // Update main users table
    await client.query(
      `
      UPDATE users
      SET email=$1,
          phone=$2,
          password_hash=$3,
          is_deleted=FALSE,
          updated_at=NOW()
      WHERE user_id=$4
      `,
      [email, phone || null, hashedPassword, user_id]
    );

    await client.query("COMMIT");

    // ✅ Corrected: added comma here
    const { rows } = await client.query(
      `
      SELECT u.user_id, u.email, u.phone,
             p.display_name, p.location_id, p.is_nationwide, p.is_onboarded
      FROM users u
      LEFT JOIN user_profiles p ON u.user_id = p.user_id
      WHERE u.user_id = $1
      `,
      [user_id]
    );

    return NextResponse.json({ message: "✅ Signup successful!", user: rows[0] });
  } catch (err: unknown) {
    await client.query("ROLLBACK");
    console.error("Final-submit error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Unknown server error" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}