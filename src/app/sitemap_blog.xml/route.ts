import { BASE_URL, xmlResponse } from "@/lib/sitemap-helpers";
import { getAllBlogPosts } from "@/lib/cache";

export const revalidate = 3600; // refresh hourly

export async function GET() {
  const posts = await getAllBlogPosts();

  const urls = posts
    .map((post) => {
      const loc = `${BASE_URL}/blog/${post.slug}`;
      const lastmod = new Date(
        post.updated_at ?? post.published_at
      ).toISOString();
      const priority = post.is_featured ? "0.9" : "0.7";

      return `
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return xmlResponse(xml);
}