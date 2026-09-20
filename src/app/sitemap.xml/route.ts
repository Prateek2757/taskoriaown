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
  "sitemaps/static.xml",
  "sitemaps/categories.xml",
  "sitemaps/cities.xml",
  "sitemaps/blog.xml",
  "sitemaps/cost-guides.xml",
];

export async function GET() {
  const { categories, cities } = await fetchServiceSitemapData();
  const count = Math.ceil(categories.length * cities.length / URLS_PER_SITEMAP);
  const categorySitemaps = Array.from(
    { length: count },
    (_, index) => `sitemaps/categories_${index + 1}.xml`
  );
  return xmlResponse(
    buildSitemapIndexXml(
      [...SITEMAPS, ...categorySitemaps].map((name) => ({ loc: `${BASE_URL}/${name}` }))
    )
  );
}
