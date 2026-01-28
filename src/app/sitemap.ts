import type { MetadataRoute } from "next";


export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.taskoria.com";

  return [
    {
      url: `${baseUrl}/sitemapstatic.xml`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/sitemapservices.xml`,
      lastModified: new Date(),
    },
  ];
}