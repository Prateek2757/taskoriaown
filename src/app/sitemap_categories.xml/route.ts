import {
    BASE_URL,
    buildUrlsetXml,
    xmlResponse,
    fetchCategories,
    fetchCities,
    uniqueStateslugs,
  } from "@/lib/sitemap-helpers";
  
  export const revalidate = 3600;
  
  export async function GET() {
    const [categories, cities] = await Promise.all([
      fetchCategories(),
      fetchCities(),
    ]);
  
    const stateslugs = uniqueStateslugs(cities);
    const entries = [];
  
    for (const cat of categories) {
      entries.push({
        loc: `${BASE_URL}/services/${cat.slug}`,
        lastmod: cat.updated_at,
        changefreq: "weekly",
        priority: 0.9,
      });
    }
  
    for (const cat of categories) {
      for (const stateSlug of stateslugs) {
        entries.push({
          loc: `${BASE_URL}/services/${cat.slug}/${stateSlug}`,
          changefreq: "weekly",
          priority: 0.8,
        });
      }
    }
  
    return xmlResponse(buildUrlsetXml(entries));
  }