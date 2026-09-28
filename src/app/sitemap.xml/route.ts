import {
  BASE_URL,
  buildSitemapIndexXml,
  xmlResponse,
  fetchServiceSitemapData,
  URLS_PER_SITEMAP,
} from "@/lib/sitemap-helpers";
export const revalidate = 3600;
export const dynamic = "force-dynamic";
const SITEMAPS = [
  "sitemap-static.xml",
  "sitemap-categories.xml",
  "sitemap-cities.xml",
  "sitemap-blog.xml",
  "sitemap-cost-guides.xml",
];

export async function GET() {
  const { categories, cities } = await fetchServiceSitemapData();
  const count = Math.ceil(categories.length * cities.length / URLS_PER_SITEMAP);
  const categorySitemaps = Array.from(
    { length: count },
    (_, index) => `sitemap-categories_${index + 1}.xml`
  );
  return xmlResponse(
    buildSitemapIndexXml(
      [...SITEMAPS, ...categorySitemaps].map((name) => ({ loc: `${BASE_URL}/${name}` }))
    )
  );
}
