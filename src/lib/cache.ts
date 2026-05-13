
import { unstable_cache } from "next/cache";
import pool from "@/lib/dbConnect";
import { City } from "@/app/[location]/(public)/(pages)/services/[...slug]/page";

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
    revalidate: 86400, 
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
    revalidate: 604800, 
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
    revalidate: 900, 
    tags: ["service-providers"],
  }
);



export const getAllCities = unstable_cache(
  async (): Promise<City[]> => {
    const result = await pool.query(`
      SELECT
        c.city_id, c.name, c.slug, c.display_name,
        c.popularity, c.parent_city_id,
        c.latitude, c.longitude, c.image_url,
        s.slug  AS state_slug,
        s.name  AS state_name,
        co.name AS country_name
      FROM cities c
      LEFT JOIN states   s  ON c.state_id   = s.state_id
      JOIN      countries co ON c.country_id = co.country_id
      ORDER BY c.popularity DESC
    `);

    const map = new Map<number, City>();
    const cities: City[] = [];

    for (const row of result.rows) {
      if (!row.parent_city_id) {
        const city: City = {
          city_id:      row.city_id,
          name:         row.name,
          slug:         row.slug,
          display_name: row.display_name,
          popularity:   row.popularity,
          latitude:     row.latitude  ? parseFloat(row.latitude)  : undefined,
          longitude:    row.longitude ? parseFloat(row.longitude) : undefined,
          image_url:    row.image_url,
          state_slug:   row.state_slug,
          state_name:   row.state_name,
          country_name: row.country_name,
          subcities:    [],
        };
        map.set(row.city_id, city);
        cities.push(city);
      }
    }

    for (const row of result.rows) {
      if (row.parent_city_id && map.has(row.parent_city_id)) {
        map.get(row.parent_city_id)!.subcities.push({
          city_id:      row.city_id,
          name:         row.name,
          slug:         row.slug,
          display_name: row.display_name,
          popularity:   row.popularity,
          image_url:    row.image_url,
        });
      }
    }

    return cities;
  },
  ["all-cities"],
  {
    revalidate: 86400, 
    tags: ["cities"],
  }
);


export const getCityBySlug = unstable_cache(
  async (slug: string) => {
    const result = await pool.query(
      `
      SELECT
        c.city_id, c.name, c.slug, c.display_name,
        c.popularity, c.latitude, c.longitude, c.image_url,
        c.parent_city_id,
        s.slug AS state_slug,
        s.name AS state_name,
        co.name AS country_name
      FROM cities c
      LEFT JOIN states s ON c.state_id = s.state_id
      JOIN countries co ON c.country_id = co.country_id
      WHERE c.slug = $1
      LIMIT 1
    `,
      [slug]
    );

    return result.rows[0] || null;
  },
  ["city-by-slug"],
  {
    revalidate: 86400,
  }
);

export const getSubcities = unstable_cache(
  async (cityId: number) => {
    const result = await pool.query(
      `
      SELECT city_id, name, slug, display_name,
             popularity, latitude, longitude, image_url
      FROM cities
      WHERE parent_city_id = $1
      ORDER BY popularity DESC
    `,
      [cityId]
    );

    return result.rows;
  },
  ["subcities"],
  {
    revalidate: 86400,
  }
);
