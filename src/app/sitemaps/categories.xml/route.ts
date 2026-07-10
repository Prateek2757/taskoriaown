import {
  BASE_URL,
  buildUrlsetXml,
  canonicalCategories,
  canonicalSeoCities,
  fetchCategories,
  fetchCities,
  uniqueStateslugs,
  xmlResponse,
} from "@/lib/sitemap-helpers";

export const revalidate = 604800;

export async function GET() {
  const [categoriesRaw, cities] = await Promise.all([
    fetchCategories(),
    fetchCities(),
  ]);
  const categories = canonicalCategories(categoriesRaw);

  const stateslugs = uniqueStateslugs(canonicalSeoCities(cities));
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
