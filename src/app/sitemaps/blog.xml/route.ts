import { BASE_URL, buildUrlsetXml, xmlResponse } from "@/lib/sitemap-helpers";
import { getAllBlogPosts } from "@/lib/cache";

export const revalidate = 3600;

export async function GET() {
  const posts = await getAllBlogPosts();

  return xmlResponse(
    buildUrlsetXml(
      posts.map((post) => ({
        loc: `${BASE_URL}/blog/${post.slug}`,
        lastmod: post.updated_at ?? post.published_at,
        changefreq: "monthly",
        priority: post.is_featured ? 0.9 : 0.7,
      }))
    )
  );
}
