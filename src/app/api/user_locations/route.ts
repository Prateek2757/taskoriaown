import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;

  const { rows } = await pool.query(
    `
    SELECT 
      ul.id,
      ul.city_id,
      c.name AS city_name,
      ul.created_at
    FROM user_locations ul
    JOIN cities c ON c.city_id = ul.city_id
    WHERE ul.user_id = $1
    ORDER BY ul.created_at DESC
    `,
    [userId]
  );

  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;
  const { city_id } = await req.json();

  if (!city_id) {
    return NextResponse.json(
      { message: "city_id is required" },
      { status: 400 }
    );
  }

  try {
    const { rows } = await pool.query(
      `
      INSERT INTO user_locations (user_id, city_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, city_id) DO NOTHING
      RETURNING id, city_id
      `,
      [userId, city_id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Location already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json({ location: rows[0] }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to add location" },
      { status: 500 }
    );
  }
}

// DELETE - Remove a location
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;
  const { city_id } = await req.json();

  if (!city_id) {
    return NextResponse.json(
      { message: "city_id is required" },
      { status: 400 }
    );
  }

  try {
    await pool.query(
      `
      DELETE FROM user_locations
      WHERE user_id = $1 AND city_id = $2
      `,
      [userId, city_id]
    );

    return NextResponse.json({ message: "Location removed successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to remove location" },
      { status: 500 }
    );
  }
}