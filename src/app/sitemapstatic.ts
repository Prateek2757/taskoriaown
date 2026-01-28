import type { MetadataRoute } from "next";

export default function sitemapStatic(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.taskoria.com";
  const currentDate = new Date();

  const corePages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/providers`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  const companyPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/trust-safety`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/careers`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  const legalPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${baseUrl}/cookie-policy`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  const staticPages = [...corePages, ...companyPages, ...legalPages];

  return Promise.resolve(staticPages);
}