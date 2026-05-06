
import { unstable_cache } from "next/cache";
import pool from "@/lib/dbConnect";

export const getCategoriesFromDB = unstable_cache(
  async () => {
    const result = await pool.query(`
      SELECT
        category_id,
        name,
        image_url,
        public_id,
        slug,
        main_category,
        faqs,
        rank,
        keywords
      FROM service_categories
      WHERE is_active = true
      ORDER BY rank ASC;
    `);
    return result.rows;
  },
  ["all-categories"],
  {
    revalidate: 3600, // 1 hour
    tags: ["categories"],
  }
);

export const getCategoryBySlug = unstable_cache(
  async (slug: string) => {
    const result = await pool.query(
      `SELECT
        category_id,
        name,
        main_category,
        image_url AS service_image_url,
        description,
        faqs,
        slug,
        service_detail
      FROM service_categories
      WHERE slug = $1`,
      [slug]
    );
    return result.rows[0] ?? null;
  },
  ["category-by-slug"],
  {
    revalidate: 3600, 
    tags: ["categories"],
  }
);

export const getCategoryQuestionsFromDB = unstable_cache(
  async (categoryId: number) => {
    const result = await pool.query(
      `SELECT
        category_question_id,
        question,
        field_type,
        options,
        is_required,
        sort_order
      FROM category_questions
      WHERE category_id = $1
      ORDER BY sort_order ASC;`,
      [categoryId]
    );
    return result.rows;
  },
  ["category-questions"],
  {
    revalidate: 21600, // 6 hours
    tags: ["category-questions"],
  }
);

export const getServiceProvidersFromDB = unstable_cache(
  async (serviceSlug: string, citySlug: string) => {
    const { rows } = await pool.query(
      `SELECT
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
       AND sc.slug = $1
      LEFT JOIN users u ON up.user_id = u.user_id
      LEFT JOIN company cp ON up.user_id = cp.user_id
      LEFT JOIN cities c ON c.city_id = up.location_id
      WHERE (c.slug = $2 OR up.is_nationwide = true)
      GROUP BY
        up.user_id, up.display_name, up.avg_rating, up.total_reviews,
        up.profile_image_url, up.is_nationwide, up.created_at,
        u.public_id, cp.company_name, cp.logo_url, c.name, c.slug
      ORDER BY up.created_at DESC;`,
      [serviceSlug, citySlug]
    );
    return rows;
  },
  ["service-providers"],
  {
    revalidate: 300, // 5 minutes
    tags: ["service-providers"],
  }
);
