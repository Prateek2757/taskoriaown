import { unstable_cache } from "next/cache";
import { cache as reactCache } from "react";
import pool from "@/lib/dbConnect";
import type { City } from "@/app/[location]/(public)/(pages)/services/[...slug]/page";

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
        parent_category_id,
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
    revalidate: 604800,
    tags: ["categories"],
  },
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
      [slug],
    );
    return result.rows[0] ?? null;
  },
  ["category-by-slug"],
  {
    revalidate: 604800,
    tags: ["categories"],
  },
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
      [categoryId],
    );
    return result.rows;
  },
  ["category-questions"],
  {
    revalidate: 604800,
    tags: ["category-questions"],
  },
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
        c.slug AS cityslug,
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
      [serviceSlug, citySlug],
    );
    return rows;
  },
  ["service-providers"],
  {
    revalidate: 900,
    tags: ["service-providers"],
  },
);

// The full Australian locality dataset is larger than Next's 2 MB data-cache
// entry limit. React cache deduplicates metadata/page reads within a request.
export const getAllCities = reactCache(
  async (): Promise<City[]> => {
    const result = await pool.query(`
      WITH canonical AS (
        SELECT DISTINCT ON (state_slug, place_slug)
          id::integer AS city_id,
          place_name AS name,
          place_slug AS slug,
          display_name,
          CASE state_slug || ':' || place_slug
            WHEN 'nsw:sydney' THEN 1000
            WHEN 'vic:melbourne' THEN 990
            WHEN 'qld:brisbane' THEN 980
            WHEN 'wa:perth' THEN 970
            WHEN 'sa:adelaide' THEN 960
            WHEN 'qld:gold-coast' THEN 950
            WHEN 'act:canberra' THEN 940
            WHEN 'nsw:newcastle' THEN 930
            WHEN 'nsw:wollongong' THEN 920
            WHEN 'tas:hobart' THEN 910
            WHEN 'nt:darwin' THEN 900
            WHEN 'qld:sunshine-coast' THEN 890
            WHEN 'vic:geelong' THEN 880
            WHEN 'qld:townsville' THEN 870
            WHEN 'qld:cairns' THEN 860
            ELSE COALESCE(accuracy, 0)
          END AS popularity,
          NULL::integer AS parent_city_id,
          latitude,
          longitude,
          NULL::text AS image_url,
          state_slug,
          state_name,
          'Australia'::text AS country_name,
          NULL::text AS city_description,
          postal_code AS postcode,
          source,
          updated_at
        FROM australia_locations
        WHERE is_active = true
          AND place_slug IS NOT NULL
          AND state_slug IS NOT NULL
        ORDER BY state_slug, place_slug, accuracy DESC NULLS LAST, updated_at DESC
      )
      SELECT * FROM canonical
      ORDER BY popularity DESC, name ASC
    `);

    const map = new Map<number, City>();
    const cities: City[] = [];

    for (const row of result.rows) {
      if (!row.parent_city_id) {
        const city: City = {
          city_id: row.city_id,
          name: row.name,
          slug: row.slug,
          display_name: row.display_name,
          popularity: row.popularity,
          latitude: row.latitude ? parseFloat(row.latitude) : undefined,
          longitude: row.longitude ? parseFloat(row.longitude) : undefined,
          image_url: row.image_url,
          state_slug: row.state_slug,
          state_name: row.state_name,
          country_name: row.country_name,
          city_description: row.city_description,
          postcode: row.postcode,
          source: row.source,
          updated_at: row.updated_at,
          subcities: [],
        };
        map.set(row.city_id, city);
        cities.push(city);
      }
    }

    for (const row of result.rows) {
      if (row.parent_city_id && map.has(row.parent_city_id)) {
        map.get(row.parent_city_id)!.subcities.push({
          city_id: row.city_id,
          name: row.name,
          slug: row.slug,
          display_name: row.display_name,
          popularity: row.popularity,
          image_url: row.image_url,
        });
      }
    }

    return cities;
  },
);

export const getCityBySlug = unstable_cache(
  async (slug: string, stateSlug?: string | null) => {
    const result = await pool.query(
      `
      SELECT
        id::integer AS city_id,
        place_name AS name,
        place_slug AS slug,
        display_name,
        COALESCE(accuracy, 0) AS popularity,
        latitude,
        longitude,
        NULL::text AS image_url,
        NULL::integer AS parent_city_id,
        state_slug,
        state_name,
        'Australia'::text AS country_name,
        postal_code AS postcode,
        source,
        updated_at
      FROM australia_locations
      WHERE place_slug = $1
        AND is_active = true
        AND ($2::text IS NULL OR state_slug = $2)
      ORDER BY accuracy DESC NULLS LAST, updated_at DESC
      LIMIT 1
    `,
      [slug, stateSlug ?? null],
    );

    return result.rows[0] || null;
  },
  ["australia-location-by-slug"],
  {
    revalidate: 86400,
  },
);

export const getSubcities = unstable_cache(
  async (_cityId: number): Promise<Record<string, unknown>[]> => {
    return [];
  },
  ["australia-location-subcities"],
  {
    revalidate: 86400,
  },
);

export const getAllBlogPosts = unstable_cache(
  async (category?: string, featured?: boolean, limit = 20, offset = 0) => {
    const conditions = ["is_published = true"];
    const values: unknown[] = [];

    if (category) {
      values.push(category);
      conditions.push(`category = $${values.length}`);
    }
    if (featured) {
      conditions.push("is_featured = true");
    }

    values.push(limit);
    const limitParam = values.length;
    values.push(offset);
    const offsetParam = values.length;

    const result = await pool.query(
      `SELECT
        post_id, slug, title, excerpt, author_name, author_role,
        author_image, image_url, category, tags, is_featured,is_published,
        views, likes, read_time, published_at
       FROM blog_posts
       WHERE ${conditions.join(" AND ")}
       ORDER BY published_at DESC
       LIMIT $${limitParam} OFFSET $${offsetParam}`,
      values,
    );

    return result.rows;
  },
  ["all-blog-posts"],
  {
    revalidate: 300,
    tags: ["blog-posts"],
  },
);

export const getBlogPostSlugs = unstable_cache(
  async () => {
    const result = await pool.query(
      `SELECT slug
       FROM blog_posts
       WHERE is_published = true
       ORDER BY published_at DESC`,
    );

    return result.rows as { slug: string }[];
  },
  ["blog-post-slugs"],
  {
    revalidate: 300,
    tags: ["blog-posts"],
  },
);

export const getBlogPostBySlug = unstable_cache(
  async (slug: string) => {
    const result = await pool.query(
      `SELECT * FROM blog_posts
       WHERE slug = $1 AND is_published = true
       LIMIT 1`,
      [slug],
    );
    return result.rows[0] ?? null;
  },
  ["blog-post-by-slug"],
  {
    revalidate: 300,
    tags: ["blog-posts"],
  },
);

export const getRelatedBlogPosts = unstable_cache(
  async (category: string, currentSlug: string, limit = 3) => {
    const result = await pool.query(
      `SELECT
        post_id, slug, title, excerpt, author_name, author_role,
        author_image, image_url, category, tags, is_featured, is_published,
        views, likes, read_time, published_at, updated_at
       FROM blog_posts
       WHERE is_published = true
         AND category = $1
         AND slug <> $2
       ORDER BY published_at DESC
       LIMIT $3`,
      [category, currentSlug, limit],
    );

    return result.rows;
  },
  ["related-blog-posts"],
  {
    revalidate: 300,
    tags: ["blog-posts"],
  },
);
