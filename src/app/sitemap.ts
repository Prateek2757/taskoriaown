import type { MetadataRoute } from "next";


export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.taskoria.com";

  return [
    {
      url: `${baseUrl}/sitemap-static.xml`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/sitemap-services.xml`,
      lastModified: new Date(),
    },
  ];
}