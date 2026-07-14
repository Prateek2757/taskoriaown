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

export const getActiveServiceCategoryCountFromDB = unstable_cache(
  async (): Promise<number> => {
    const result = await pool.query(`
      SELECT COUNT(*)::integer AS count
      FROM service_categories
      WHERE is_active = true;
    `);

    return Number(result.rows[0]?.count ?? 0);
  },
  ["active-service-category-count"],
  {
    revalidate: 604800,
    tags: ["categories"],
  },
);

export type ProfessionalPackageRow = {
  package_id: number;
  name: string;
  description: string;
  price: number;
  duration_months: number | null;
  visibility_stars: number;
  visibility_description: string;
  badge: string | null;
  free_enquiries: number;
  enquiry_price: number;
  discount_percentage: number;
  stripe_price_id?: string;
  free_trail_days?: string;
  has_performance_insights: boolean;
  has_verified_badge: boolean;
  has_unlocked_inbox: boolean;
  display_order: number;
};

export const getProfessionalPackagesFromDB = unstable_cache(
  async (): Promise<ProfessionalPackageRow[]> => {
    const result = await pool.query(
      `SELECT 
        package_id,
        name,
        description,
        price,
        duration_months,
        visibility_stars,
        visibility_description,
        badge,
        free_enquiries,
        enquiry_price,
        discount_percentage,
        has_performance_insights,
        has_verified_badge,
        has_unlocked_inbox,
        stripe_price_id,
        free_trail_days,
        display_order
      FROM professional_packages 
      WHERE is_active = true 
      ORDER BY display_order`
    );

    return result.rows;
  },
  ["professional-packages"],
  {
    revalidate: 604800,
    tags: ["professional-packages"],
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
function mapAustraliaLocationRow(row: any): City {
  return {
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
}

export const getPopularSeoCitiesFromDB = unstable_cache(
  async (limit = 80): Promise<City[]> => {
    const result = await pool.query(
      `
      WITH canonical AS (
        SELECT DISTINCT ON (state_slug, place_slug)
          id::integer AS city_id,
          place_name AS name,
          place_slug AS slug,
          display_name,
          COALESCE(popularity, 0) AS popularity,
          latitude,
          longitude,
          image_url,
          state_slug,
          state_name,
          'Australia'::text AS country_name,
          description AS city_description,
          postal_code AS postcode,
          source,
          updated_at
        FROM australia_locations
        WHERE is_active = true
          AND place_slug IS NOT NULL
          AND state_slug IS NOT NULL
        ORDER BY state_slug, place_slug, popularity DESC NULLS LAST
      )
      SELECT * FROM canonical
      ORDER BY popularity DESC, name ASC
      LIMIT $1
    `,
      [limit],
    );

    return result.rows.map(mapAustraliaLocationRow);
  },
  ["popular-seo-cities"],
  {
    revalidate: 604800,
    tags: ["locations"],
  },
);

export const getSeoCitiesByStateFromDB = reactCache(
  async (stateSlug: string): Promise<City[]> => {
    const result = await pool.query(
      `
      WITH canonical AS (
        SELECT DISTINCT ON (state_slug, place_slug)
          id::integer AS city_id,
          place_name AS name,
          place_slug AS slug,
          display_name,
          COALESCE(popularity, 0) AS popularity,
          latitude,
          longitude,
          image_url,
          state_slug,
          state_name,
          'Australia'::text AS country_name,
          description AS city_description,
          postal_code AS postcode,
          source,
          updated_at
        FROM australia_locations
        WHERE is_active = true
          AND place_slug IS NOT NULL
          AND state_slug = $1
        ORDER BY state_slug, place_slug, popularity DESC NULLS LAST
      )
      SELECT * FROM canonical
      ORDER BY popularity DESC, name ASC
    `,
      [stateSlug],
    );

    return result.rows.map(mapAustraliaLocationRow);
  },
);

export const getPopularSeoCitiesByStateFromDB = unstable_cache(
  async (stateSlug: string, limit = 24): Promise<City[]> => {
    const result = await pool.query(
      `
      WITH canonical AS (
        SELECT DISTINCT ON (state_slug, place_slug)
          id::integer AS city_id,
          place_name AS name,
          place_slug AS slug,
          display_name,
          COALESCE(popularity, 0) AS popularity,
          latitude,
          longitude,
          image_url,
          state_slug,
          state_name,
          'Australia'::text AS country_name,
          description AS city_description,
          postal_code AS postcode,
          source,
          updated_at
        FROM australia_locations
        WHERE is_active = true
          AND place_slug IS NOT NULL
          AND state_slug = $1
        ORDER BY state_slug, place_slug, popularity DESC NULLS LAST
      )
      SELECT * FROM canonical
      ORDER BY popularity DESC, name ASC
      LIMIT $2
    `,
      [stateSlug, limit],
    );

    return result.rows.map(mapAustraliaLocationRow);
  },
  ["popular-seo-cities-by-state"],
  {
    revalidate: 604800,
    tags: ["locations"],
  },
);

export const getSeoCityBySlugFromDB = unstable_cache(
  async (stateSlug: string | null, citySlug: string): Promise<City | null> => {
    const result = await pool.query(
      `
      SELECT
        id::integer AS city_id,
        place_name AS name,
        place_slug AS slug,
        display_name,
        COALESCE(popularity, 0) AS popularity,
        latitude,
        longitude,
        image_url,
        state_slug,
        state_name,
        'Australia'::text AS country_name,
        description AS city_description,
        postal_code AS postcode,
        source,
        updated_at
      FROM australia_locations
      WHERE is_active = true
        AND place_slug = $1
        AND ($2::text IS NULL OR state_slug = $2)
      ORDER BY popularity DESC NULLS LAST, updated_at DESC
      LIMIT 1
    `,
      [citySlug, stateSlug],
    );

    return result.rows[0] ? mapAustraliaLocationRow(result.rows[0]) : null;
  },
  ["seo-city-by-slug"],
  {
    revalidate: 604800,
    tags: ["locations"],
  },
);

export const getSeoRedirectCandidatesByStateFromDB = reactCache(
  async (stateSlug: string, citySlug: string): Promise<City[]> => {
    const result = await pool.query(
      `
      WITH raw_match AS (
        SELECT
          id::integer AS city_id,
          place_name AS name,
          place_slug AS slug,
          display_name,
          COALESCE(popularity, 0) AS popularity,
          latitude,
          longitude,
          image_url,
          state_slug,
          state_name,
          'Australia'::text AS country_name,
          description AS city_description,
          postal_code AS postcode,
          source,
          updated_at
        FROM australia_locations
        WHERE is_active = true
          AND place_slug = $2
          AND state_slug = $1
        ORDER BY popularity DESC NULLS LAST, updated_at DESC
        LIMIT 1
      ),
      canonical AS (
        SELECT DISTINCT ON (state_slug, place_slug)
          id::integer AS city_id,
          place_name AS name,
          place_slug AS slug,
          display_name,
          COALESCE(popularity, 0) AS popularity,
          latitude,
          longitude,
          image_url,
          state_slug,
          state_name,
          'Australia'::text AS country_name,
          description AS city_description,
          postal_code AS postcode,
          source,
          updated_at
        FROM australia_locations
        WHERE is_active = true
          AND place_slug IS NOT NULL
          AND state_slug = $1
        ORDER BY state_slug, place_slug, popularity DESC NULLS LAST
      )
      SELECT * FROM raw_match
      UNION ALL
      SELECT *
      FROM canonical
      WHERE EXISTS (SELECT 1 FROM raw_match)
        AND slug <> $2
      ORDER BY popularity DESC, name ASC
    `,
      [stateSlug, citySlug],
    );

    return result.rows.map(mapAustraliaLocationRow);
  },
);

export const getSeoStatesFromDB = unstable_cache(
  async (): Promise<{ state_slug: string; state_name: string }[]> => {
    const result = await pool.query(`
      SELECT
        state_slug,
        MIN(state_name) AS state_name,
        MAX(COALESCE(popularity, 0)) AS popularity
      FROM australia_locations
      WHERE is_active = true
        AND place_slug IS NOT NULL
        AND state_slug IS NOT NULL
      GROUP BY state_slug
      ORDER BY state_name ASC
    `);

    return result.rows;
  },
  ["seo-states"],
  {
    revalidate: 604800,
    tags: ["locations"],
  },
);

export const getActiveSeoCityCountFromDB = unstable_cache(
  async (): Promise<number> => {
    const result = await pool.query(`
      WITH canonical AS (
        SELECT DISTINCT ON (state_slug, place_slug)
          state_slug,
          place_slug
        FROM australia_locations
        WHERE is_active = true
          AND place_slug IS NOT NULL
          AND state_slug IS NOT NULL
        ORDER BY state_slug, place_slug, popularity DESC NULLS LAST
      )
      SELECT COUNT(*)::integer AS count
      FROM canonical;
    `);

    return Number(result.rows[0]?.count ?? 0);
  },
  ["active-seo-city-count"],
  {
    revalidate: 604800,
    tags: ["locations"],
  },
);

export const getSeoStateSummaryFromDB = unstable_cache(
  async (
    stateSlug: string,
  ): Promise<{
    state_slug: string;
    state_name: string;
    country_name: string;
    city_count: number;
  } | null> => {
    const result = await pool.query(
      `
      WITH canonical AS (
        SELECT DISTINCT ON (state_slug, place_slug)
          state_slug,
          state_name,
          place_slug
        FROM australia_locations
        WHERE is_active = true
          AND place_slug IS NOT NULL
          AND state_slug = $1
        ORDER BY state_slug, place_slug, popularity DESC NULLS LAST
      )
      SELECT
        state_slug,
        MIN(state_name) AS state_name,
        'Australia'::text AS country_name,
        COUNT(*)::integer AS city_count
      FROM canonical
      GROUP BY state_slug
      LIMIT 1
    `,
      [stateSlug],
    );

    return result.rows[0] ?? null;
  },
  ["seo-state-summary"],
  {
    revalidate: 604800,
    tags: ["locations"],
  },
);

export const getSeoLocationIndexFromDB = unstable_cache(
  async (
    perStateLimit = 20,
  ): Promise<(City & { city_count: number; state_rank: number })[]> => {
    const result = await pool.query(
      `
      WITH canonical AS (
        SELECT DISTINCT ON (state_slug, place_slug)
          id::integer AS city_id,
          place_name AS name,
          place_slug AS slug,
          display_name,
          COALESCE(popularity, 0) AS popularity,
          latitude,
          longitude,
          image_url,
          state_slug,
          state_name,
          'Australia'::text AS country_name,
          description AS city_description,
          postal_code AS postcode,
          source,
          updated_at
        FROM australia_locations
        WHERE is_active = true
          AND place_slug IS NOT NULL
          AND state_slug IS NOT NULL
        ORDER BY state_slug, place_slug, popularity DESC NULLS LAST
      ),
      state_counts AS (
        SELECT state_slug, COUNT(*)::integer AS city_count
        FROM canonical
        GROUP BY state_slug
      ),
      ranked AS (
        SELECT
          canonical.*,
          state_counts.city_count,
          ROW_NUMBER() OVER (
            PARTITION BY canonical.state_slug
            ORDER BY canonical.popularity DESC, canonical.name ASC
          )::integer AS state_rank
        FROM canonical
        JOIN state_counts ON state_counts.state_slug = canonical.state_slug
      )
      SELECT *
      FROM ranked
      WHERE state_rank <= $1
      ORDER BY state_name ASC, state_rank ASC, name ASC
    `,
      [perStateLimit],
    );

    return result.rows.map((row) => ({
      ...mapAustraliaLocationRow(row),
      city_count: Number(row.city_count),
      state_rank: Number(row.state_rank),
    }));
  },
  ["seo-location-index"],
  {
    revalidate: 604800,
    tags: ["locations"],
  },
);

export const getNearbySeoCitiesFromDB = unstable_cache(
  async (
    stateSlug: string,
    citySlug: string,
    latitude?: number | null,
    longitude?: number | null,
    limit = 10,
  ): Promise<City[]> => {
    const result = await pool.query(
      `
      WITH canonical AS (
        SELECT DISTINCT ON (state_slug, place_slug)
          id::integer AS city_id,
          place_name AS name,
          place_slug AS slug,
          display_name,
          COALESCE(popularity, 0) AS popularity,
          latitude,
          longitude,
          image_url,
          state_slug,
          state_name,
          'Australia'::text AS country_name,
          description AS city_description,
          postal_code AS postcode,
          source,
          updated_at
        FROM australia_locations
        WHERE is_active = true
          AND place_slug IS NOT NULL
          AND state_slug IS NOT NULL
        ORDER BY state_slug, place_slug, popularity DESC NULLS LAST
      )
      SELECT *,
        CASE
          WHEN $3::double precision IS NULL
            OR $4::double precision IS NULL
            OR latitude IS NULL
            OR longitude IS NULL
          THEN NULL
          ELSE 6371 * acos(
            LEAST(
              1,
              GREATEST(
                -1,
                cos(radians($3::double precision))
                  * cos(radians(latitude::double precision))
                  * cos(radians(longitude::double precision) - radians($4::double precision))
                  + sin(radians($3::double precision))
                  * sin(radians(latitude::double precision))
              )
            )
          )
        END AS distance
      FROM canonical
      WHERE NOT (state_slug = $1 AND slug = $2)
      ORDER BY
        CASE
          WHEN $3::double precision IS NULL OR $4::double precision IS NULL
          THEN CASE WHEN state_slug = $1 THEN 0 ELSE 1 END
          ELSE 0
        END ASC,
        distance ASC NULLS LAST,
        popularity DESC,
        name ASC
      LIMIT $5
    `,
      [stateSlug, citySlug, latitude ?? null, longitude ?? null, limit],
    );

    return result.rows.map(mapAustraliaLocationRow);
  },
  ["nearby-seo-cities"],
  {
    revalidate: 604800,
    tags: ["locations"],
  },
);

export type LocationDirectoryRow = {
  city_id: number;
  name: string;
  slug: string;
  display_name: string | null;
  postcode: string | null;
  state_slug: string;
};

export const getLocationDirectoryByStateFromDB = unstable_cache(
  async (stateSlug: string): Promise<LocationDirectoryRow[]> => {
    const result = await pool.query(
      `
      SELECT DISTINCT ON (state_slug, place_slug)
        id::integer AS city_id,
        place_name AS name,
        place_slug AS slug,
        display_name,
        postal_code AS postcode,
        state_slug
      FROM australia_locations
      WHERE is_active = true
        AND place_slug IS NOT NULL
        AND state_slug = $1
      ORDER BY
        state_slug,
        place_slug,
        popularity DESC NULLS LAST,
        updated_at DESC
    `,
      [stateSlug],
    );

    return result.rows.sort((a, b) =>
      a.name.localeCompare(b.name, "en-AU", { sensitivity: "base" })
    );
  },
  ["location-directory-by-state"],
  {
    revalidate: 604800,
    tags: ["locations"],
  },
);

export const getAllCities = reactCache(
  async (): Promise<City[]> => {
    const result = await pool.query(`
      WITH canonical AS (
        SELECT DISTINCT ON (state_slug, place_slug)
          id::integer AS city_id,
          place_name AS name,
          place_slug AS slug,
          display_name,
  COALESCE(popularity, 0) AS popularity,
            NULL::integer AS parent_city_id,
          latitude,
          longitude,
          image_url ,
          state_slug,
          state_name,
          'Australia'::text AS country_name,
          description AS city_description,
          postal_code AS postcode,
          source,
          updated_at
        FROM australia_locations
        WHERE is_active = true
          AND place_slug IS NOT NULL
          AND state_slug IS NOT NULL
        ORDER BY state_slug, place_slug, popularity DESC NULLS LAST
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
