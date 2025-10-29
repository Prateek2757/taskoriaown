import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";

export async function GET() {
  try {
    const { rows } = await pool.query(`
        SELECT 
          up.user_id,
          up.display_name AS name,
          up.avg_rating,
          up.total_reviews,
          up.profile_image_id AS image,
          json_agg(DISTINCT sc.name) AS services
        FROM user_profiles up
        LEFT JOIN user_categories uc ON up.user_id = uc.user_id
        LEFT JOIN service_categories sc ON sc.category_id = uc.category_id
        WHERE up.provider_verified = true
        GROUP BY up.user_id, up.display_name, up.avg_rating, up.total_reviews, up.profile_image_id
        ORDER BY up.avg_rating DESC;
      `);

    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to fetch providers" }, { status: 500 });
  }
}