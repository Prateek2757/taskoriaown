import {
  buildServiceLocationSitemapEntries,
  buildUrlsetXml,
  parseServiceLocationSitemapIndex,
  xmlResponse,
} from "@/lib/sitemap-helpers";

export const revalidate = 604800;

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const sitemapIndex = parseServiceLocationSitemapIndex(slug);

  if (sitemapIndex < 0) {
    return new Response("Not found", { status: 404 });
  }

  const entries = await buildServiceLocationSitemapEntries(sitemapIndex);

  if (entries.length === 0) {
    return new Response("Not found", { status: 404 });
  }

  return xmlResponse(buildUrlsetXml(entries));
}
