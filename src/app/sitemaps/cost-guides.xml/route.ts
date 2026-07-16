import {
  BASE_URL,
  buildUrlsetXml,
  canonicalCategories,
  fetchCategories,
  xmlResponse,
} from "@/lib/sitemap-helpers";

export const dynamic = "force-dynamic";

export async function GET() {
  const categories = canonicalCategories(await fetchCategories());

  return xmlResponse(
    buildUrlsetXml(
      categories.map((category) => ({
        loc: `${BASE_URL}/cost-guides/${category.slug}`,
        lastmod: category.updated_at,
        changefreq: "monthly",
        priority: 0.7,
      }))
    )
  );
}
