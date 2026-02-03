import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export async function GET(req: Request, { params }: Props) {
  try {
    const { slug = [] } = await params;
    const serviceSlug = slug[0];
    const citySlug = slug[1] || null;

    if (!serviceSlug || !citySlug) {
      return NextResponse.json(
        { message: "Service and city are required" },
        { status: 400 }
      );
    }

    // If slug is a sub-city like 'sydney-5', also include 'sydney'
    const mainCitySlug = citySlug.split('-')[0];

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
        json_agg(DISTINCT sc.name) FILTER (WHERE sc.name IS NOT NULL) AS services,
        json_agg(DISTINCT sc.slug) FILTER (WHERE sc.slug IS NOT NULL) AS slugs,
        json_agg(DISTINCT c.name) FILTER (WHERE c.name IS NOT NULL) AS locationnames,
        json_agg(DISTINCT c.slug) FILTER (WHERE c.slug IS NOT NULL) AS cityslugs
    
      FROM user_profiles up
      JOIN professional_subscriptions ps 
        ON ps.user_id = up.user_id 
       AND ps.status = 'active'
      JOIN user_categories uc 
        ON up.user_id = uc.user_id
      JOIN service_categories sc 
        ON sc.category_id = uc.category_id
       AND sc.slug = $1
      LEFT JOIN users u ON up.user_id = u.user_id
      LEFT JOIN company cp ON up.user_id = cp.user_id
      LEFT JOIN user_locations ul ON ul.user_id = up.user_id
      LEFT JOIN cities c ON c.city_id = ul.city_id
    
      WHERE 
        (
          c.slug ILIKE $2 || '%'   
          OR c.slug = $3            
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
        cp.logo_url
    
      ORDER BY up.created_at DESC;
      `,
      [serviceSlug, citySlug, mainCitySlug]
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