import {
  buildUrlsetXml,
  fetchServiceSitemapData,
  serviceLocationEntries,
  xmlResponse,
} from "@/lib/sitemap-helpers";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const match = /^categories_([1-9]\d*)\.xml$/.exec(slug);
  const page = match ? Number(match[1]) - 1 : -1;
  if (!Number.isSafeInteger(page) || page < 0) {
    return new Response("Sitemap not found", { status: 404 });
  }
  const { categories, cities } = await fetchServiceSitemapData();
  const entries = serviceLocationEntries(categories, cities, page);
  if (!entries.length) {
    return new Response("Sitemap not found", { status: 404 });
  }
  return xmlResponse(buildUrlsetXml(entries));
}
