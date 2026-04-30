import type { MetadataRoute } from "next";

export const revalidate = 3600;

const BASE_URL = "https://www.taskoria.com";


interface Category {
  category_id: number;
  name: string;
  slug: string;
  parent_category_id: number | null;
  updated_at?: string;
}

interface City {
  city_id: number;
  slug: string;
  state_slug: string;
  popularity: number;
  updated_at?: string;
  subcities?: { slug: string; updated_at?: string }[];
}

interface BlogPost {
  slug: string;
  updated_at?: string;
  published_at?: string;
}


async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/signup/category-selection`, {
      next: { revalidate: 3600 },
    });
    return res.ok ? res.json() : [];
  } catch {
    return [];
  }
}

async function fetchCities(): Promise<City[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/service-location`, {
      next: { revalidate: 3600 },
    });
    return res.ok ? res.json() : [];
  } catch {
    return [];
  }
}

async function fetchBlogPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/blog`, {
      next: { revalidate: 3600 },
    });
    return res.ok ? res.json() : [];
  } catch {
    return [];
  }
}


function url(
  path: string,
  opts: {
    lastModified?: string | Date;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  }
): MetadataRoute.Sitemap[number] {
  return {
    url: `${BASE_URL}${path}`,
    lastModified: opts.lastModified ? new Date(opts.lastModified) : new Date(),
    changeFrequency: opts.changeFrequency,
    priority: opts.priority,
  };
}

function uniqueStates(cities: City[]): string[] {
  return [...new Set(cities.map((c) => c.state_slug).filter(Boolean))];
}


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, cities, blogPosts] = await Promise.all([
    fetchCategories(),
    fetchCities(),
    fetchBlogPosts(),
  ]);

  // Split categories into parents and children
  const parentCategories = categories.filter((c) => !c.parent_category_id);
  const childCategories  = categories.filter((c) =>  c.parent_category_id);

  // Unique state slugs
  const stateslugs = uniqueStates(cities);

  const entries: MetadataRoute.Sitemap = [];

  // ── 1. CORE PAGES ──────────────────────────────────────────────────────────
  const corePages = [
    { path: "/",                   priority: 1.0, freq: "daily"   },
    { path: "/services",           priority: 0.9, freq: "daily"   },
    { path: "/cities",             priority: 0.8, freq: "weekly"  },
    { path: "/blog",               priority: 0.8, freq: "daily"   },
    { path: "/about-us",           priority: 0.6, freq: "monthly" },
    { path: "/trust-safety",       priority: 0.7, freq: "monthly" },
    { path: "/careers",            priority: 0.5, freq: "monthly" },
    { path: "/privacy-policy",     priority: 0.3, freq: "yearly"  },
    { path: "/terms-and-conditions", priority: 0.3, freq: "yearly" },
    { path: "/cookie-policy",      priority: 0.3, freq: "yearly"  },
  ] as const;

  for (const p of corePages) {
    entries.push(url(p.path, { priority: p.priority, changeFrequency: p.freq }));
  }

 
  for (const cat of parentCategories) {
    entries.push(
      url(`/services/${cat.slug}`, {
        lastModified: cat.updated_at,
        priority: 0.9,
        changeFrequency: "weekly",
      })
    );
  }

  for (const cat of childCategories) {
    entries.push(
      url(`/services/${cat.slug}`, {
        lastModified: cat.updated_at,
        priority: 0.7,
        changeFrequency: "weekly",
      })
    );
  }

  for (const cat of parentCategories) {
    for (const stateSlug of stateslugs) {
      entries.push(
        url(`/services/${cat.slug}/${stateSlug}`, {
          priority: 0.8,
          changeFrequency: "weekly",
        })
      );
    }
  }

  for (const cat of childCategories) {
    for (const stateSlug of stateslugs) {
      entries.push(
        url(`/services/${cat.slug}/${stateSlug}`, {
          priority: 0.65,
          changeFrequency: "weekly",
        })
      );
    }
  }


  const sortedCities = [...cities].sort((a, b) => b.popularity - a.popularity);

  for (const city of sortedCities) {
    if (!city.state_slug) continue;

    const rank = sortedCities.indexOf(city);
    const cityPriority = rank < 10 ? 0.75 : rank < 30 ? 0.7 : rank < 60 ? 0.65 : 0.6;

    for (const cat of parentCategories) {
      entries.push(
        url(`/services/${cat.slug}/${city.state_slug}/${city.slug}`, {
          lastModified: city.updated_at,
          priority: cityPriority,
          changeFrequency: "weekly",
        })
      );
    }

    for (const cat of childCategories) {
      entries.push(
        url(`/services/${cat.slug}/${city.state_slug}/${city.slug}`, {
          lastModified: city.updated_at,
          priority: Math.max(0.5, cityPriority - 0.1),
          changeFrequency: "weekly",
        })
      );
    }

    for (const sub of city.subcities ?? []) {
      for (const cat of parentCategories) {
        entries.push(
          url(
            `/services/${cat.slug}/${city.state_slug}/${city.slug}/${sub.slug}`,
            {
              lastModified: sub.updated_at ?? city.updated_at,
              priority: 0.55,
              changeFrequency: "monthly",
            }
          )
        );
      }
    }
  }

  for (const stateSlug of stateslugs) {
    entries.push(
      url(`/cities/${stateSlug}`, {
        priority: 0.8,
        changeFrequency: "weekly",
      })
    );
  }

  for (const city of sortedCities) {
    if (!city.state_slug) continue;
    const rank = sortedCities.indexOf(city);
    const cityPriority = rank < 10 ? 0.75 : rank < 30 ? 0.7 : 0.65;q

    entries.push(
      url(`/cities/${city.state_slug}/${city.slug}`, {
        lastModified: city.updated_at,
        priority: cityPriority,
        changeFrequency: "weekly",
      })
    );
  }


  return entries;
}