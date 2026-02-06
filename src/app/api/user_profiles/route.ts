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
    WITH profile AS (
      SELECT 
        up.user_id,
        up.display_name,
        up.location_id,
        ci.name AS location_name,
        up.is_nationwide,
        u.is_email_verified,
        up.profile_image_url,
        json_agg(
          json_build_object(
            'category_id', uc.category_id,
            'category_name', sc.name
          )
        ) FILTER (WHERE uc.category_id IS NOT NULL) AS categories
      FROM user_profiles up
      LEFT JOIN user_categories uc ON uc.user_id = up.user_id
      LEFT JOIN users u ON u.user_id = up.user_id
      LEFT JOIN service_categories sc ON sc.category_id = uc.category_id
      LEFT JOIN cities ci ON ci.city_id = up.location_id
      WHERE up.user_id = $1
      GROUP BY up.user_id, up.display_name, up.location_id,u.is_email_verified, ci.name, up.is_nationwide, up.profile_image_url
    ),

    user_locations AS (
      SELECT 
        ul.user_id,
        json_agg(
          json_build_object(
            'id', ul.id,
            'city_id', ul.city_id,
            'city_name', c.name,
            'created_at', ul.created_at
          ) ORDER BY ul.created_at DESC
        ) AS locations
      FROM user_locations ul
      JOIN cities c ON c.city_id = ul.city_id
      WHERE ul.user_id = $1
      GROUP BY ul.user_id
    ),

    company_profile AS (
      SELECT 
        c.user_id,
        c.company_name,
        c.logo_url,
        c.about AS company_about,
        c.company_size,
        c.years_in_business
      FROM company c
      WHERE c.user_id = $1
    ),

    active_sub AS (
      SELECT 
        ps.user_id,
        ps.package_id,
        ps.start_date,
        ps.end_date,
        ps.status,
        ps.payment_transaction_id
      FROM professional_subscriptions ps
      WHERE ps.user_id = $1
      AND ps.status = 'active'
      AND ps.end_date > NOW()
      ORDER BY ps.end_date DESC
      LIMIT 1
    )

    SELECT
      p.*,
      COALESCE(ul.locations, '[]'::json) AS locations,
      cp.company_name,
      cp.logo_url,
      cp.company_about,
      cp.company_size,
      cp.years_in_business,
      (cp.user_id IS NOT NULL) AS has_company,
      EXISTS (SELECT 1 FROM active_sub) AS is_pro,
      (SELECT row_to_json(s) FROM active_sub s) AS active_subscription
    FROM profile p
    LEFT JOIN user_locations ul ON ul.user_id = p.user_id
    LEFT JOIN company_profile cp ON cp.user_id = p.user_id;
    `,
    [userId]
  );

  return NextResponse.json(rows[0] || {});
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;
  const { display_name, location_id, is_nationwide, profile_image_url } =
    await req.json();

  await pool.query(
    `
    UPDATE user_profiles
    SET 
      display_name = COALESCE($1, display_name),
      location_id = COALESCE($2, location_id),
      is_nationwide = COALESCE($3, is_nationwide),
      profile_image_url = COALESCE($4, profile_image_url),
      updated_at = NOW()
    WHERE user_id = $5
    `,
    [display_name, location_id, is_nationwide, profile_image_url, userId]
  );

  const { rows } = await pool.query(
    `
    SELECT display_name, location_id, is_nationwide, profile_image_url
    FROM user_profiles
    WHERE user_id = $1
    `,
    [userId]
  );

  return NextResponse.json({ profile: rows[0] });
}