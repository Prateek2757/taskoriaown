import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    const { searchParams } = new URL(req.url);
    const serviceSlug = searchParams.get("service");
    const citySlug = searchParams.get("city");

    if (!serviceSlug || !citySlug) {
      return NextResponse.json(
        { message: "Service and city are required" },
        { status: 400 }
      );
    }

    const { rows } = await pool.query(
      `
      SELECT 
        up.user_id,
        up.display_name AS name,
        up.avg_rating,
        up.total_reviews,
        up.is_nationwide AS nationwide,
        u.public_id,
        up.profile_image_url AS image,
        up.created_at AS joineddate,
        cp.company_name,
        cp.logo_url,

        json_agg(DISTINCT sc.name) 
          FILTER (WHERE sc.name IS NOT NULL) AS services,

        json_agg(DISTINCT sc.slug) 
          FILTER (WHERE sc.slug IS NOT NULL) AS slugs,

        c.name AS locationname,
        c.slug AS cityslug

      FROM user_profiles up

      JOIN professional_subscriptions ps 
        ON ps.user_id = up.user_id 
       AND ps.status = 'active'

      JOIN user_categories uc 
        ON up.user_id = uc.user_id

      JOIN service_categories sc 
        ON sc.category_id = uc.category_id
       AND sc.slug = $1   -- 🔥 SERVICE FILTER

      LEFT JOIN users u ON up.user_id = u.user_id
      LEFT JOIN company cp ON up.user_id = cp.user_id
      LEFT JOIN cities c ON c.city_id = up.location_id

      WHERE 
        (
          c.slug = $2        -- city-based providers
          OR up.is_nationwide = true
        )

      GROUP BY 
        up.user_id,
        up.display_name,
        up.avg_rating,
        up.total_reviews,
        up.profile_image_url,
        up.is_nationwide,
        up.created_at,
        u.public_id,
        cp.company_name,
        cp.logo_url,
        c.name,
        c.slug

      ORDER BY up.created_at DESC;
      `,
      [serviceSlug, citySlug]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch providers" },
      { status: 500 }
    );
  }
}