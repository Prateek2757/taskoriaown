import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

// ✅ GET: Fetch profile
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;

  const { rows } = await pool.query(
    `
    SELECT 
      up.display_name,
      up.location_id,
      ci.name AS location_name,
      up.is_nationwide,
      json_agg(
        json_build_object(
          'category_id', uc.category_id,
          'category_name', sc.name
        )
      ) FILTER (WHERE uc.category_id IS NOT NULL) AS categories
    FROM user_profiles up
    LEFT JOIN user_categories uc ON uc.user_id = up.user_id
    LEFT JOIN service_categories sc ON sc.category_id = uc.category_id
    LEFT JOIN cities ci ON ci.city_id = up.location_id
    WHERE up.user_id = $1
    GROUP BY up.display_name, up.location_id, ci.name, up.is_nationwide;
    `,
    [userId]
  );

  return NextResponse.json(rows[0] || {});
}

// ✅ PUT: Update location or is_nationwide
export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { location_id, is_nationwide } = await req.json();
  const userId = session.user.id;

  await pool.query(
    `
    UPDATE user_profiles
    SET 
      location_id = $1,
      is_nationwide = $2,
      updated_at = NOW()
    WHERE user_id = $3
    `,
    [location_id || null, is_nationwide || false, userId]
  );

  return NextResponse.json({ success: true });
}
