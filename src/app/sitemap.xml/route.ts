import {
  BASE_URL,
  buildSitemapIndexXml,
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
  return xmlResponse(
    buildSitemapIndexXml(
      STATIC_SITEMAPS.map((name) => ({ loc: `${BASE_URL}/${name}` }))
    )
  );
}
