import {
  BASE_URL,
  buildSitemapIndexXml,
  getServiceLocationSitemapCount,
  serviceLocationSitemapPath,
  xmlResponse,
} from "@/lib/sitemap-helpers";

export const revalidate = 604800;

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
