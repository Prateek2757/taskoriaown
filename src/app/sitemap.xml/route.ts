import {
  BASE_URL,
  buildSitemapIndexXml,
  getServiceLocationSitemapCount,
  serviceLocationSitemapPath,
  xmlResponse,
} from "@/lib/sitemap-helpers";

// Sitemap structure changes infrequently; avoid a database-backed function run
// for every crawler request.
export const revalidate = 86400;

const STATIC_SITEMAPS = [
  "sitemaps/static.xml",
  "sitemaps/categories.xml",
  "sitemaps/cities.xml",
  "sitemaps/blog.xml",
];

export async function GET() {
  const now = new Date().toISOString();

  const serviceLocationCount = await getServiceLocationSitemapCount();

  const serviceLocationSitemaps = Array.from(
    { length: serviceLocationCount },
    (_, i) => serviceLocationSitemapPath(i + 1)
  );
  const allSitemaps = [...STATIC_SITEMAPS, ...serviceLocationSitemaps];

  return xmlResponse(
    buildSitemapIndexXml(
      allSitemaps.map((name) => ({
        loc: `${BASE_URL}/${name}`,
        lastmod: now,
      }))
    )
  );
}
