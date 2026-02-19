import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;

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
        c.name AS locationname,
    
        json_agg(DISTINCT sc.name) 
          FILTER (WHERE sc.name IS NOT NULL) AS services,
    
        json_agg(DISTINCT sc.slug) 
          FILTER (WHERE sc.slug IS NOT NULL) AS slug,
    
        COALESCE(
          json_agg(DISTINCT jsonb_build_object(
            'platform', usl.platform,
            'url', usl.url,
            'username', usl.username,
            'display_order', usl.display_order
          )) FILTER (WHERE usl.id IS NOT NULL),
          '[]'
        ) AS social_links,
    
        COALESCE(
          json_agg(DISTINCT jsonb_build_object(
            'id', ups.id,
            'title', ups.title,
            'description', ups.description
          )) FILTER (WHERE ups.id IS NOT NULL),
          '[]'
        ) AS profile_services,
    
        -- PROFILE PHOTOS (Portfolio)
        COALESCE(
          json_agg(DISTINCT jsonb_build_object(
            'id', upp.id,
            'photo_url', upp.photo_url,
            'title', upp.title,
            'description', upp.description,
            'is_featured', upp.is_featured,
            'display_order', upp.display_order
          )) FILTER (WHERE upp.id IS NOT NULL),
          '[]'
        ) AS photos,
    
        COALESCE(
          json_agg(DISTINCT jsonb_build_object(
            'id', uf.id,
            'question', uf.question,
            'answer', uf.answer,
            'category', uf.category,
            'display_order', uf.display_order
          )) FILTER (WHERE uf.id IS NOT NULL),
          '[]'
        ) AS faqs,
    
        COALESCE(
          json_agg(DISTINCT jsonb_build_object(
            'id', ua.id,
            'name', ua.name,
            'issuing_organization', ua.issuing_organization,
            'display_order', ua.display_order
          )) FILTER (WHERE ua.id IS NOT NULL),
          '[]'
        ) AS accreditations
    
      FROM user_profiles up
    
      JOIN professional_subscriptions ps 
        ON ps.user_id = up.user_id AND ps.status IN ('active','trialing')
    
      LEFT JOIN users u ON up.user_id = u.user_id
      LEFT JOIN user_categories uc ON up.user_id = uc.user_id
      LEFT JOIN service_categories sc ON sc.category_id = uc.category_id
      LEFT JOIN company cp ON up.user_id = cp.user_id
      LEFT JOIN cities c ON c.city_id = up.location_id
    
      LEFT JOIN user_social_links usl ON up.user_id = usl.user_id AND usl.is_visible = true
      LEFT JOIN user_profile_services ups ON up.user_id = ups.user_id
      LEFT JOIN user_profile_photos upp ON up.user_id = upp.user_id
      LEFT JOIN user_faqs uf ON up.user_id = uf.user_id AND uf.is_visible = true
      LEFT JOIN user_accreditations ua ON up.user_id = ua.user_id
    
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
    `);

    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch providers" },
      { status: 500 }
    );
  }
}
