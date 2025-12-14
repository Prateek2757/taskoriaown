import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user.id

    const { rows } = await pool.query(`
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
        json_agg(DISTINCT sc.slug) FILTER (WHERE sc.slug IS NOT NULL) AS slug,
        c.name AS locationname

      FROM user_profiles up
      LEFT JOIN users u ON up.user_id = u.user_id
      LEFT JOIN user_categories uc ON up.user_id = uc.user_id
      LEFT JOIN service_categories sc ON sc.category_id = uc.category_id
      LEFT JOIN company cp ON up.user_id = cp.user_id
      LEFT JOIN cities c ON c.city_id = up.location_id
     

     
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
        c.name

      ORDER BY up.created_at DESC;
    `,);

    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch providers" },
      { status: 500 }
    );
  }
}