import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  const res = await fetch(
    `${baseUrl}/api/signup/category-selection`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    console.error("Failed to fetch services for sitemap");
    return [...corePages, ...companyPages, ...legalPages];
  }

  const allservices = await res.json();

  const servicePages: MetadataRoute.Sitemap = allservices.map(
    (service: any) => ({
      url: `${baseUrl}/services/${service.slug}`,
      lastModified: service.updated_at
        ? new Date(service.updated_at)
        : currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    })
  );

  return [
    ...corePages,
    ...companyPages,
    ...legalPages,
    ...servicePages,
  ];
}