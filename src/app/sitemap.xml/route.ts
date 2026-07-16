import {
  BASE_URL,
  buildSitemapIndexXml,
  getServiceLocationSitemapCount,
  serviceLocationSitemapPath,
  xmlResponse,
} from "@/lib/sitemap-helpers";

// The index size depends on database-backed sitemap data. Generate it at
// request time so the Docker build does not need a PostgreSQL connection.
export const dynamic = "force-dynamic";

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
