import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/dbConnect";

type Props = {
  params: Promise<{ slug?: string[] }>;
};

function toPositiveLimit(value: string | null) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return 10;
  return Math.min(Math.floor(parsed), 50);
}

export async function GET(req: NextRequest, { params }: Props) {
  try {
    const { slug = [] } = await params;
    const searchParams = req.nextUrl.searchParams;
    const serviceSlug = searchParams.has("service")
      ? searchParams.get("service") || null
      : slug[0] || null;
    const stateSlug = searchParams.get("state") || null;
    const citySlug = searchParams.get("city") || slug[1] || null;
    const limit = toPositiveLimit(searchParams.get("limit"));

    const values: unknown[] = [];
    const where: string[] = ["u.status = 'active'"];

    if (serviceSlug) {
      values.push(serviceSlug);
      where.push(`
        EXISTS (
          SELECT 1
          FROM user_categories scoped_uc
          JOIN service_categories scoped_sc
            ON scoped_sc.category_id = scoped_uc.category_id
          WHERE scoped_uc.user_id = up.user_id
            AND scoped_sc.slug = $${values.length}
        )
      `);
    }

    if (stateSlug || citySlug) {
      if (citySlug) {
        values.push(citySlug);
        const cityMatch = `
          pl.slug = $${values.length}
          OR pl.parent_slug = $${values.length}
        `;

        if (stateSlug) {
          values.push(stateSlug);
          where.push(`
            (
              up.is_nationwide = true
              OR (
                pl.state_slug = $${values.length}
                AND (${cityMatch})
              )
            )
          `);
        } else {
          where.push(`
            (
              up.is_nationwide = true
              OR (${cityMatch})
            )
          `);
        }
      } else if (stateSlug) {
        values.push(stateSlug);
        where.push(`
          (
            up.is_nationwide = true
            OR pl.state_slug = $${values.length}
          )
        `);
      }
    }

    values.push(limit);

    const { rows } = await pool.query(
      `
      WITH provider_locations AS (
        SELECT DISTINCT
          up_inner.user_id,
          c.city_id,
          c.name,
          c.slug,
          s.name AS state_name,
          s.slug AS state_slug,
          parent.name AS parent_name,
          parent.slug AS parent_slug
        FROM user_profiles up_inner
        LEFT JOIN cities c ON c.city_id = up_inner.location_id
        LEFT JOIN cities parent ON parent.city_id = c.parent_city_id
        LEFT JOIN states s ON s.state_id = c.state_id
        WHERE c.city_id IS NOT NULL

        UNION

        SELECT DISTINCT
          ul.user_id,
          c.city_id,
          c.name,
          c.slug,
          s.name AS state_name,
          s.slug AS state_slug,
          parent.name AS parent_name,
          parent.slug AS parent_slug
        FROM user_locations ul
        JOIN cities c ON c.city_id = ul.city_id
        LEFT JOIN cities parent ON parent.city_id = c.parent_city_id
        LEFT JOIN states s ON s.state_id = c.state_id
      ),
      active_sub AS (
        SELECT DISTINCT
          ps.user_id
        FROM professional_subscriptions ps
        WHERE ps.status IN ('active', 'trialing', '')
      ),
      response_stats AS (
        SELECT
          professional_id AS user_id,
          COUNT(*) AS total_responses
        FROM task_responses
        GROUP BY professional_id
      )
      SELECT 
        up.user_id,
        up.display_name AS name,
        up.avg_rating,
        up.total_reviews,
        up.is_nationwide AS nationwide,
        u.public_id,
        u.is_email_verified,
        u.profile_completion,
        up.profile_image_url AS image,
        up.created_at AS joineddate,
        cp.company_name,
        cp.slug AS company_slug,
        cp.logo_url,
        cp.about AS company_about,
        cp.company_size,
        cp.years_in_business,
        (cp.user_id IS NOT NULL) AS has_company,
        (asub.user_id IS NOT NULL) AS is_pro,
        COALESCE(rs.total_responses, 0) AS total_responses_sent,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object(
            'id', ua.id,
            'name', ua.name,
            'issuing_organization', ua.issuing_organization,
            'display_order', ua.display_order
          )) FILTER (WHERE ua.id IS NOT NULL),
          '[]'
        ) AS accreditations,
        json_agg(DISTINCT sc.name) FILTER (WHERE sc.name IS NOT NULL) AS services,
        json_agg(DISTINCT sc.slug) FILTER (WHERE sc.slug IS NOT NULL) AS slugs,
        json_agg(DISTINCT pl.name) FILTER (WHERE pl.name IS NOT NULL) AS locationnames,
        json_agg(DISTINCT pl.slug) FILTER (WHERE pl.slug IS NOT NULL) AS cityslugs,
        json_agg(DISTINCT pl.state_name) FILTER (WHERE pl.state_name IS NOT NULL) AS statenames
    
      FROM user_profiles up

      JOIN users u ON up.user_id = u.user_id
      LEFT JOIN company cp ON up.user_id = cp.user_id
      LEFT JOIN user_categories uc ON up.user_id = uc.user_id
      LEFT JOIN service_categories sc ON sc.category_id = uc.category_id
      LEFT JOIN provider_locations pl ON pl.user_id = up.user_id
      LEFT JOIN active_sub asub ON asub.user_id = up.user_id
      LEFT JOIN response_stats rs ON rs.user_id = up.user_id
      LEFT JOIN user_accreditations ua ON ua.user_id = up.user_id
    
      WHERE ${where.join("\n        AND ")}
    
      GROUP BY 
        up.user_id,
        up.display_name,
        up.avg_rating,
        up.total_reviews,
        up.profile_image_url,
        up.is_nationwide,
        up.created_at,
        u.public_id,
        u.is_email_verified,
        u.profile_completion,
        cp.company_name,
        cp.slug,
        cp.logo_url,
        cp.about,
        cp.company_size,
        cp.years_in_business,
        cp.user_id,
        asub.user_id,
        rs.total_responses
    
      ORDER BY
        CASE WHEN up.is_nationwide = true THEN 1 ELSE 0 END,
        up.created_at DESC
      LIMIT $${values.length};
      `,
      values
    );

    return NextResponse.json(rows, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch providers" },
      { status: 500 }
    );
  }
}
