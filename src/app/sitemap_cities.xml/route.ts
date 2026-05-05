import {
  BASE_URL,
  buildUrlsetXml,
  xmlResponse,
  fetchCategories,
  fetchCities,
  uniqueStateslugs,
  cityPriorityByRank,
} from "@/lib/sitemap-helpers";

export const revalidate = 3600;

export async function GET() {
  const [categories, cities] = await Promise.all([
    fetchCategories(),
    fetchCities(),
  ]);

  const stateslugs   = uniqueStateslugs(cities);
  const sortedCities = [...cities].sort((a, b) => b.popularity - a.popularity);
  const entries      = [];

  for (const stateSlug of stateslugs) {
    entries.push({
      loc: `${BASE_URL}/locations/${stateSlug}`,
      changefreq: "weekly",
      priority: 0.8,
    });
  }

  // /cities/[state]/[city]
  for (const [rank, city] of sortedCities.entries()) {
    if (!city.state_slug) continue;
    entries.push({
      loc: `${BASE_URL}/locations/${city.state_slug}/${city.slug}`,
      lastmod: city.updated_at,
      changefreq: "weekly",
      priority: rank < 10 ? 0.75 : rank < 30 ? 0.7 : 0.65,
    });
  }

  // /services/[category]/[state]/[city]
  // for (const [rank, city] of sortedCities.entries()) {
  //   if (!city.state_slug) continue;
  //   const cityPriority = cityPriorityByRank(rank);

  //   // for (const cat of categories) {
  //   //   entries.push({
  //   //     loc: `${BASE_URL}/services/${cat.slug}/${city.state_slug}/${city.slug}`,
  //   //     lastmod: city.updated_at,
  //   //     changefreq: "weekly",
  //   //     priority: cityPriority,
  //   //   });
  //   // }

  //   // /services/[category]/[state]/[city]/[subcity]
  //   // for (const sub of city.subcities ?? []) {
  //   //   for (const cat of categories) {
  //   //     entries.push({
  //   //       loc: `${BASE_URL}/services/${cat.slug}/${city.state_slug}/${city.slug}/${sub.slug}`,
  //   //       lastmod: sub.updated_at ?? city.updated_at,
  //   //       changefreq: "monthly",
  //   //       priority: 0.55,
  //   //     });
  //   //   }
  //   // }
  // }

  return xmlResponse(buildUrlsetXml(entries));
}