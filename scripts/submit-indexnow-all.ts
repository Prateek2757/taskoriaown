import { submitToIndexNow } from "@/lib/indexnowbing";
import "dotenv/config";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

if (!SITE_URL) {
  throw new Error("Missing NEXT_PUBLIC_SITE_URL");
}

async function fetchXml(url: string) {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status}`);
  }

  return res.text();
}

function extractLocs(xml: string): string[] {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) =>
    match[1].trim()
  );
}

async function getAllUrlsFromSitemap(sitemapUrl: string): Promise<string[]> {
  const xml = await fetchXml(sitemapUrl);
  const locs = extractLocs(xml);

  const pageUrls: string[] = [];

  for (const loc of locs) {
    if (loc.endsWith(".xml")) {
      const nestedUrls = await getAllUrlsFromSitemap(loc);
      pageUrls.push(...nestedUrls);
    } else if (loc.startsWith(SITE_URL!)) {
      pageUrls.push(loc);
    }
  }

  return [...new Set(pageUrls)];
}

function chunkArray<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];

  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }

  return chunks;
}

async function main() {
  const sitemapUrl = `${SITE_URL}/sitemap.xml`;

  console.log("Reading sitemap:", sitemapUrl);

  const urls = await getAllUrlsFromSitemap(sitemapUrl);

  console.log(`Found ${urls.length} URLs`);

  if (urls.length === 0) {
    console.log("No URLs found.");
    return;
  }

  const batches = chunkArray(urls, 1000);

  for (const [index, batch] of batches.entries()) {
    console.log(`Submitting batch ${index + 1}/${batches.length}`);
    await submitToIndexNow(batch);
    console.log(`Submitted ${batch.length} URLs`);
  }

  console.log("All existing URLs submitted to IndexNow.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});