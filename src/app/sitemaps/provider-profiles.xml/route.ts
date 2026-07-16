import {
  BASE_URL,
  buildUrlsetXml,
  fetchProviderProfiles,
  xmlResponse,
} from "@/lib/sitemap-helpers";

export const dynamic = "force-dynamic";

export async function GET() {
  const profiles = await fetchProviderProfiles();

  return xmlResponse(
    buildUrlsetXml(
      profiles.map((profile) => ({
        loc: `${BASE_URL}/providerprofile/${profile.slug}`,
        lastmod: profile.updated_at,
        changefreq: "weekly",
        priority: 0.6,
      }))
    )
  );
}
