// app/sitemaps/services/[id]/route.ts
import {
    BASE_URL,
    buildUrlsetXml,
    xmlResponse,
    fetchCategories,
    fetchCities,
    cityPriorityByRank,
  } from "@/lib/sitemap-helpers";
  
  export const revalidate = 3600;
  
  const URLS_PER_SITEMAP = 40000;
  
  export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {
    const { id } = await params;
    const sitemapIndex = Number(id) - 1;
  
    // Reject invalid IDs immediately
    if (isNaN(sitemapIndex) || sitemapIndex < 0) {
      return new Response("Not found", { status: 404 });
    }
  
    const [categories, cities] = await Promise.all([
      fetchCategories(),
      fetchCities(),
    ]);
  
    const sortedCities = [...cities].sort((a, b) => b.popularity - a.popularity);
  
    const allEntries = [];
  
    for (const [rank, city] of sortedCities.entries()) {
      if (!city.state_slug) continue;
  
      const cityPriority = cityPriorityByRank(rank);
  
      for (const cat of categories) {
        allEntries.push({
          loc: `${BASE_URL}/services/${cat.slug}/${city.state_slug}/${city.slug}`,
          lastmod: city.updated_at,
          changefreq: "weekly",
          priority: cityPriority,
        });
      }
  
      for (const sub of city.subcities ?? []) {
        for (const cat of categories) {
          allEntries.push({
            loc: `${BASE_URL}/services/${cat.slug}/${city.state_slug}/${city.slug}/${sub.slug}`,
            lastmod: sub.updated_at ?? city.updated_at,
            changefreq: "monthly",
            priority: 0.55,
          });
        }
      }
    }
  
    const start = sitemapIndex * URLS_PER_SITEMAP;
  
    // Return 404 if page index exceeds available data
    if (start >= allEntries.length) {
      return new Response("Not found", { status: 404 });
    }
  
    const entries = allEntries.slice(start, start + URLS_PER_SITEMAP);
  
    return xmlResponse(buildUrlsetXml(entries));
  }