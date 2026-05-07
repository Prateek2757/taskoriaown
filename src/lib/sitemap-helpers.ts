const BASE_URL = process.env.NEXT_PUBLIC_APP_URL;

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
  slug: string;
  state_slug: string;
  popularity: number;
  updated_at?: string;
  subcities?: Subcity[];
}

export interface BlogPost {
  slug: string;
  updated_at?: string;
  published_at?: string;
}

// ── Fetchers ──────────────────────────────────────────────────────────────────

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

export const fetchCategories = () =>
  safeFetch<Category>(`${BASE_URL}/api/signup/category-selection`);

export const fetchCities = () =>
  safeFetch<City>(`${BASE_URL}/api/service-location`);

export const fetchBlogPosts = () =>
  safeFetch<BlogPost>(`${BASE_URL}/api/blog`);


export function uniqueStateslugs(cities: City[]): string[] {
  return [...new Set(cities.map((c) => c.state_slug).filter(Boolean))];
}

export function cityPriorityByRank(rank: number): number {
  if (rank < 10) return 0.75;
  if (rank < 30) return 0.70;
  if (rank < 60) return 0.65;
  return 0.60;
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
  const urls = entries
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

export async function getServiceSitemapCount(): Promise<number> {
  const [categories, cities] = await Promise.all([
    fetchCategories(),
    fetchCities(),
  ]);

  let total = 0;
  for (const city of cities) {
    if (!city.state_slug) continue;
    total += categories.length; // city-level pages
    total += (city.subcities?.length ?? 0) * categories.length; // subcity pages
  }

  return Math.ceil(total / URLS_PER_SITEMAP);
}

export const URLS_PER_SITEMAP = 5000;