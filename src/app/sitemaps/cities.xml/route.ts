import {
  BASE_URL,
  buildUrlsetXml,
  xmlResponse,
  fetchCities,
  uniqueStateslugs,
  cityPriorityByRank,
  canonicalSeoCities,
} from "@/lib/sitemap-helpers";

export const revalidate = 604800;

export async function GET() {
  const cities = canonicalSeoCities(await fetchCities());

  const stateSlugs = uniqueStateslugs(cities);
  const sortedCities = [...cities].sort((a, b) => b.popularity - a.popularity);
  const entries = [];

  for (const stateSlug of stateSlugs) {
    entries.push({
      loc: `${BASE_URL}/locations/${stateSlug}`,
      changefreq: "weekly",
      priority: 0.8,
    });
  }

  for (const [rank, city] of sortedCities.entries()) {
    if (!city.state_slug || !city.slug) continue;

    entries.push({
      loc: `${BASE_URL}/locations/${city.state_slug}/${city.slug}`,
      lastmod: city.updated_at,
      changefreq: "weekly",
      priority: cityPriorityByRank(rank),
    });
  }

  return xmlResponse(buildUrlsetXml(entries));
}
