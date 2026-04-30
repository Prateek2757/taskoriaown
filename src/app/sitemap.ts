import type { MetadataRoute } from "next";

export const revalidate = 3600;

const BASE_URL = "https://www.taskoria.com";

const SITEMAP_ID = {
  STATIC:     0,
  CATEGORIES: 1,
  CITIES:     2,
  BLOG:       3,
} as const;

type SitemapId = (typeof SITEMAP_ID)[keyof typeof SITEMAP_ID];

interface Category {
  category_id: number;
  name: string;
  slug: string;
  updated_at?: string;
}

interface Subcity {
  slug: string;
  updated_at?: string;
}

interface City {
  city_id: number;
  slug: string;
  state_slug: string;
  popularity: number;
  updated_at?: string;
  subcities?: Subcity[];
}

interface BlogPost {
  slug: string;
  updated_at?: string;
  published_at?: string;
}

type ChangeFreq = MetadataRoute.Sitemap[number]["changeFrequency"];



async function safeFetch<T>(url: string): Promise<T[]> {
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      console.warn(`[sitemap] ${url} responded ${res.status}`);
      return [];
    }
    return await res.json();
  } catch (err) {
    console.error(`[sitemap] Failed to fetch ${url}:`, err);
    return [];
  }
}

const fetchCategories = () =>
  safeFetch<Category>(`${BASE_URL}/api/signup/category-selection`);

const fetchCities = () =>
  safeFetch<City>(`${BASE_URL}/api/service-location`);

const fetchBlogPosts = () =>
  safeFetch<BlogPost>(`${BASE_URL}/api/blog`);



function makeEntry(
  path: string,
  priority: number,
  changeFrequency: ChangeFreq,
  lastModified?: string | Date
): MetadataRoute.Sitemap[number] {
  return {
    url: `${BASE_URL}${path}`,
    lastModified: lastModified ? new Date(lastModified) : new Date(),
    changeFrequency,
    priority,
  };
}

function uniqueStateslugs(cities: City[]): string[] {
  return [...new Set(cities.map((c) => c.state_slug).filter(Boolean))];
}

function cityPriorityByRank(rank: number): number {
  if (rank < 10) return 0.75;
  if (rank < 30) return 0.70;
  if (rank < 60) return 0.65;
  return 0.60;
}

export function generateSitemaps() {
  return Object.values(SITEMAP_ID).map((id) => ({ id }));
}

export default async function sitemap({
  id,
}: {
  id: SitemapId;
}): Promise<MetadataRoute.Sitemap> {
  switch (id) {
    case SITEMAP_ID.STATIC: {
      const pages: { path: string; priority: number; freq: ChangeFreq }[] = [
        { path: "/",                       priority: 1.0, freq: "daily"   },
        { path: "/services",               priority: 0.9, freq: "daily"   },
        { path: "/cities",                 priority: 0.8, freq: "weekly"  },
        { path: "/blog",                   priority: 0.8, freq: "daily"   },
        { path: "/about-us",               priority: 0.6, freq: "monthly" },
        { path: "/trust-safety",           priority: 0.7, freq: "monthly" },
        { path: "/careers",               priority: 0.5, freq: "monthly" },
        { path: "/privacy-policy",         priority: 0.3, freq: "yearly"  },
        { path: "/terms-and-conditions",   priority: 0.3, freq: "yearly"  },
        { path: "/cookie-policy",          priority: 0.3, freq: "yearly"  },
      ];

      return pages.map((p) => makeEntry(p.path, p.priority, p.freq));
    }

    case SITEMAP_ID.CATEGORIES: {
      const [categories, cities] = await Promise.all([
        fetchCategories(),
        fetchCities(),
      ]);

      const stateslugs = uniqueStateslugs(cities);
      const entries: MetadataRoute.Sitemap = [];

      for (const cat of categories) {
        entries.push(
          makeEntry(`/services/${cat.slug}`, 0.9, "weekly", cat.updated_at)
        );
      }

      for (const cat of categories) {
        for (const stateSlug of stateslugs) {
          entries.push(
            makeEntry(`/services/${cat.slug}/${stateSlug}`, 0.8, "weekly")
          );
        }
      }

      return entries;
    }

    case SITEMAP_ID.CITIES: {
      const [categories, cities] = await Promise.all([
        fetchCategories(),
        fetchCities(),
      ]);

      const stateslugs   = uniqueStateslugs(cities);
      const sortedCities = [...cities].sort((a, b) => b.popularity - a.popularity);
      const entries: MetadataRoute.Sitemap = [];

      for (const stateSlug of stateslugs) {
        entries.push(makeEntry(`/cities/${stateSlug}`, 0.8, "weekly"));
      }

      for (const [rank, city] of sortedCities.entries()) {
        if (!city.state_slug) continue;
        const priority = rank < 10 ? 0.75 : rank < 30 ? 0.7 : 0.65;

        entries.push(
          makeEntry(
            `/cities/${city.state_slug}/${city.slug}`,
            priority,
            "weekly",
            city.updated_at
          )
        );
      }

      for (const [rank, city] of sortedCities.entries()) {
        if (!city.state_slug) continue;
        const cityPriority = cityPriorityByRank(rank);

        for (const cat of categories) {
          entries.push(
            makeEntry(
              `/services/${cat.slug}/${city.state_slug}/${city.slug}`,
              cityPriority,
              "weekly",
              city.updated_at
            )
          );
        }

        for (const sub of city.subcities ?? []) {
          for (const cat of categories) {
            entries.push(
              makeEntry(
                `/services/${cat.slug}/${city.state_slug}/${city.slug}/${sub.slug}`,
                0.55,
                "monthly",
                sub.updated_at ?? city.updated_at
              )
            );
          }
        }
      }

      return entries;
    }

    // ── 3. Blog posts ────────────────────────────────────────────────────────
    // case SITEMAP_ID.BLOG: {
    //   const blogPosts = await fetchBlogPosts();

    //   return blogPosts.map((post) =>
    //     makeEntry(
    //       `/blog/${post.slug}`,
    //       0.6,
    //       "monthly",
    //       post.updated_at ?? post.published_at
    //     )
    //   );
    // }

    default:
      return [];
  }
}