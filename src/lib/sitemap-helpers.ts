import pool from "@/lib/dbConnect";
import { getCityDedupKey } from "@/lib/location-labels";
import { filterSeoLocations } from "@/lib/seo-locations";

const BASE_URL = (
  process.env.NEXT_PUBLIC_APP_URL ?? "https://www.taskoria.com"
).replace(/\/$/, "");

export { BASE_URL };

export interface Category {
  category_id: number;
  slug: string;
  updated_at?: string;
}

export interface Subcity {
  slug: string;
  updated_at?: string;
}

export interface City {
  city_id: number;
  name?: string;
  slug: string;
  display_name?: string | null;
  state_slug: string;
  state_name?: string | null;
  popularity: number;
  postcode?: string | number | null;
  source?: string | null;
  updated_at?: string;
  subcities?: Subcity[];
}

export interface BlogPost {
  slug: string;
  updated_at?: string;
  published_at?: string;
}

export interface ProviderProfile {
  slug: string;
  updated_at?: string;
}

export const URLS_PER_SITEMAP = 5000;
const MAX_URLS_PER_SITEMAP = 50000;
const SERVICE_LOCATION_SITEMAP_PREFIX = "australia";

export async function safeFetch<T>(url: string): Promise<T[]> {
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      console.warn(`[sitemap] ${url} → ${res.status}`);
      return [];
    }
    return await res.json();
  } catch (err) {
    console.error(`[sitemap] Failed to fetch ${url}:`, err);
    return [];
  }
}

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const result = await pool.query(`
      SELECT
        category_id,
        slug,
        updated_at
      FROM service_categories
      WHERE is_active = true
        AND slug IS NOT NULL
      ORDER BY rank ASC NULLS LAST, name ASC
    `);

    return result.rows;
  } catch (err) {
    console.error("[sitemap] Failed to fetch categories:", err);
    return [];
  }
};

export const fetchCities = async (): Promise<City[]> => {
  try {
    const result = await pool.query(`
      WITH canonical AS (
        SELECT DISTINCT ON (state_slug, place_slug)
          id::integer AS city_id,
          place_name AS name,
          place_slug AS slug,
          display_name,
          COALESCE(popularity, 0) AS popularity,
          state_slug,
          state_name,
          postal_code AS postcode,
          source,
          updated_at
        FROM australia_locations
        WHERE is_active = true
          AND place_slug IS NOT NULL
          AND state_slug IS NOT NULL
        ORDER BY state_slug, place_slug, popularity DESC NULLS LAST
      )
      SELECT *
      FROM canonical
      ORDER BY popularity DESC, name ASC
    `);

    return result.rows.map((city) => ({
      ...city,
      subcities: [],
    }));
  } catch (err) {
    console.error("[sitemap] Failed to fetch cities:", err);
    return [];
  }
};

export const fetchBlogPosts = () => safeFetch<BlogPost>(`${BASE_URL}/api/blog`);

export const fetchProviderProfiles = async (): Promise<ProviderProfile[]> => {
  try {
    const result = await pool.query(`
      SELECT
        cp.slug,
        COALESCE(
          MAX(ups.updated_at),
          MAX(upp.updated_at),
          MAX(uf.updated_at),
          MAX(ua.updated_at),
          up.created_at
        ) AS updated_at
      FROM user_profiles up
      JOIN users u ON up.user_id = u.user_id
      JOIN company cp ON up.user_id = cp.user_id
      JOIN user_profile_services ups ON up.user_id = ups.user_id
      LEFT JOIN user_profile_photos upp ON up.user_id = upp.user_id
      LEFT JOIN user_faqs uf ON up.user_id = uf.user_id AND uf.is_visible = true
      LEFT JOIN user_accreditations ua ON up.user_id = ua.user_id
      WHERE u.status = 'active'
        AND cp.slug IS NOT NULL
        AND cp.slug <> ''
        AND up.display_name IS NOT NULL
      GROUP BY cp.slug, up.created_at
      ORDER BY up.created_at DESC
    `);

    return result.rows;
  } catch (err) {
    console.error("[sitemap] Failed to fetch provider profiles:", err);
    return [];
  }
};

export function uniqueStateslugs(cities: City[]): string[] {
  return [...new Set(cities.map((c) => c.state_slug).filter(Boolean))];
}

export function cityPriorityByRank(rank: number): number {
  if (rank < 10) return 0.75;
  if (rank < 30) return 0.7;
  if (rank < 60) return 0.65;
  return 0.6;
}

interface UrlEntry {
  loc: string;
  lastmod?: string | Date;
  changefreq: string;
  priority: number;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function buildUrlsetXml(entries: UrlEntry[]): string {
  const uniqueEntries = dedupeEntries(entries);

  if (uniqueEntries.length > MAX_URLS_PER_SITEMAP) {
    throw new Error(
      `Sitemap contains ${uniqueEntries.length} URLs. Split it below ${MAX_URLS_PER_SITEMAP}.`
    );
  }

  const urls = uniqueEntries
    .map((e) => {
      const lastmod = e.lastmod
        ? new Date(e.lastmod).toISOString()
        : new Date().toISOString();
      return [
        `  <url>`,
        `    <loc>${escapeXml(e.loc)}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        `    <changefreq>${e.changefreq}</changefreq>`,
        `    <priority>${e.priority.toFixed(1)}</priority>`,
        `  </url>`,
      ].join("\n");
    })
    .join("\n");

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    urls,
    `</urlset>`,
  ].join("\n");
}

export function xmlResponse(body: string): Response {
  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}

export function buildSitemapIndexXml(
  entries: { loc: string; lastmod?: string | Date }[]
) {
  const sitemaps = entries
    .map((entry) => {
      const lastmod = entry.lastmod
        ? new Date(entry.lastmod).toISOString()
        : new Date().toISOString();

      return [
        `  <sitemap>`,
        `    <loc>${escapeXml(entry.loc)}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        `  </sitemap>`,
      ].join("\n");
    })
    .join("\n");

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    sitemaps,
    `</sitemapindex>`,
  ].join("\n");
}

export function dedupeEntries<T extends { loc: string }>(entries: T[]): T[] {
  const seen = new Set<string>();

  return entries.filter((entry) => {
    if (seen.has(entry.loc)) return false;
    seen.add(entry.loc);
    return true;
  });
}

export function serviceLocationSitemapPath(pageNumber: number): string {
  return `sitemaps/service-locations/${SERVICE_LOCATION_SITEMAP_PREFIX}-${pageNumber}.xml`;
}

export function parseServiceLocationSitemapIndex(slug: string): number {
  const name = slug.replace(/\.xml$/, "");
  const pageNumber = Number(name.match(/(\d+)$/)?.[1]);

  return Number.isInteger(pageNumber) && pageNumber > 0 ? pageNumber - 1 : -1;
}

export function canonicalSeoCities(cities: City[]): City[] {
  const canonicalCities = new Map<string, City>();

  for (const city of filterSeoLocations(cities)) {
    const key = `${city.state_slug}:${getCityDedupKey(city)}`;

    if (!canonicalCities.has(key)) {
      canonicalCities.set(key, city);
    }
  }

  return Array.from(canonicalCities.values());
}

export async function getServiceLocationSitemapCount(): Promise<number> {
  const [categories, cities] = await Promise.all([
    fetchCategories(),
    fetchCities(),
  ]);

  let total = 0;
  for (const city of canonicalSeoCities(cities)) {
    if (!city.state_slug || !city.slug) continue;
    total += categories.length;
    total += (city.subcities?.length ?? 0) * categories.length;
  }

  return Math.ceil(total / URLS_PER_SITEMAP);
}

export const getServiceSitemapCount = getServiceLocationSitemapCount;

export async function buildServiceLocationSitemapEntries(
  sitemapIndex: number
): Promise<UrlEntry[]> {
  const [categories, cities] = await Promise.all([
    fetchCategories(),
    fetchCities(),
  ]);

  const sortedCities = canonicalSeoCities(cities).sort(
    (a, b) => b.popularity - a.popularity
  );

  const start = sitemapIndex * URLS_PER_SITEMAP;
  const end = start + URLS_PER_SITEMAP;

  let currentIndex = 0;
  const entries: UrlEntry[] = [];

  for (const [rank, city] of sortedCities.entries()) {
    if (!city.state_slug || !city.slug) continue;

    const cityPriority = cityPriorityByRank(rank);

    for (const cat of categories) {
      if (currentIndex >= start && currentIndex < end) {
        entries.push({
          loc: `${BASE_URL}/services/${cat.slug}/${city.state_slug}/${city.slug}`,
          lastmod: city.updated_at,
          changefreq: "weekly",
          priority: cityPriority,
        });
      }
      currentIndex++;
      if (currentIndex >= end) break;
    }

    for (const sub of city.subcities ?? []) {
      for (const cat of categories) {
        if (currentIndex >= start && currentIndex < end) {
          entries.push({
            loc: `${BASE_URL}/services/${cat.slug}/${city.state_slug}/${city.slug}/${sub.slug}`,
            lastmod: sub.updated_at ?? city.updated_at,
            changefreq: "monthly",
            priority: 0.55,
          });
        }
        currentIndex++;
        if (currentIndex >= end) break;
      }
      if (currentIndex >= end) break;
    }

    if (currentIndex >= end) break;
  }

  return entries;
}
