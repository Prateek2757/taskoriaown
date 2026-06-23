import {
  BASE_URL,
  buildUrlsetXml,
  fetchCategories,
  xmlResponse,
} from "@/lib/sitemap-helpers";

export const revalidate = 604800;

export async function GET() {
  const categories = await fetchCategories();

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
