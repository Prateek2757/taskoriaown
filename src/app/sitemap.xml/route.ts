// import { BASE_URL, xmlResponse } from "@/lib/sitemap-helpers";

// export const revalidate = 3600;

// const SITEMAPS = [
//   "sitemap_static.xml",
//   "sitemap_categories.xml",
//   "sitemap_cities.xml",
// ];

// export async function GET() {
//   const now = new Date().toISOString();

//   const sitemaps = SITEMAPS.map(
//     (name) => `
//   <sitemap>
//     <loc>${BASE_URL}/${name}</loc>
//     <lastmod>${now}</lastmod>
//   </sitemap>`
//   ).join("\n");

//   const xml = [
//     `<?xml version="1.0" encoding="UTF-8"?>`,
//     `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
//     sitemaps,
//     `</sitemapindex>`,
//   ].join("\n");

//   return xmlResponse(xml);
// }

import { BASE_URL, getServiceSitemapCount, xmlResponse } from "@/lib/sitemap-helpers";

export const revalidate =  604800;

const STATIC_SITEMAPS = [
  "sitemap_static.xml",
  "sitemap_categories.xml",
  "sitemap_cities.xml",
];


export async function GET() {
  const now = new Date().toISOString();

  const serviceCount = await getServiceSitemapCount(); 

  const serviceSitemaps = Array.from(
    { length: serviceCount },
    (_, i) => `sitemaps/services/${i + 1}.xml`
  );
  const allSitemaps = [...STATIC_SITEMAPS, ...serviceSitemaps];

  const sitemaps = allSitemaps
    .map(
      (name) => `
  <sitemap>
    <loc>${BASE_URL}/${name}</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps}
</sitemapindex>`;

  return xmlResponse(xml);
}
