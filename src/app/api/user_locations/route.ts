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
      ul.distance_mile as radius,
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
  const { city_id , radius } = await req.json();

  if (!city_id) {
    return NextResponse.json(
      { message: "city_id is required" },
      { status: 400 }
    );
  }

  try {
    const { rows } = await pool.query(
      `
      INSERT INTO user_locations (user_id, city_id ,distance_mile)
      VALUES ($1, $2 , $3)
      ON CONFLICT (user_id, city_id) DO NOTHING
      RETURNING id, city_id
      `,
      [userId, city_id , radius]
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

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;
  const { old_city_id, new_city_id, radius } = await req.json();

  if (!old_city_id || !new_city_id || !radius) {
    return NextResponse.json(
      { message: "old_city_id, new_city_id, and radius are required" },
      { status: 400 }
    );
  }

  try {
    if (old_city_id !== new_city_id) {
      const { rows: existingNew } = await pool.query(
        `SELECT id FROM user_locations WHERE user_id = $1 AND city_id = $2`,
        [userId, new_city_id]
      );

      if (existingNew.length > 0) {
        return NextResponse.json(
          { message: "This location is already in your list" },
          { status: 409 }
        );
      }
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      await client.query(
        `DELETE FROM user_locations WHERE user_id = $1 AND city_id = $2`,
        [userId, old_city_id]
      );

      const { rows } = await client.query(
        `
        INSERT INTO user_locations (user_id, city_id, distance_mile, created_at)
        VALUES ($1, $2, $3, NOW())
        ON CONFLICT (user_id, city_id) 
        DO UPDATE SET distance_mile = $3, updated_at = NOW()
        RETURNING id, city_id, distance_mile, created_at
        `,
        [userId, new_city_id, radius]
      );

      await client.query('COMMIT');

      // Get city name
      const { rows: cityRows } = await pool.query(
        `SELECT name FROM cities WHERE city_id = $1`,
        [new_city_id]
      );

      return NextResponse.json({
        ...rows[0],
        city_name: cityRows[0]?.name,
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error("Error updating location:", error);
    return NextResponse.json(
      { message: "Failed to update location" },
      { status: 500 }
    );
  }
}


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