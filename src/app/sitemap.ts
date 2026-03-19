import type { MetadataRoute } from "next";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.taskoria.com";
  const currentDate = new Date();

  const coreRoutes = [
    { path: "", priority: 1.0, changeFreq: "daily" as const },
    { path: "/services", priority: 0.9, changeFreq: "daily" as const },
    { path: "/providers", priority: 0.8, changeFreq: "daily" as const },
  ];

  const companyRoutes = [
    { path: "/trust-safety", priority: 0.7, changeFreq: "monthly" as const },
    { path: "/about-us", priority: 0.6, changeFreq: "monthly" as const },
    { path: "/careers", priority: 0.5, changeFreq: "monthly" as const },
  ];

  const legalRoutes = [
    { path: "/privacy-policy", priority: 0.3, changeFreq: "yearly" as const },
    { path: "/terms-and-conditions", priority: 0.3, changeFreq: "yearly" as const },
    { path: "/cookie-policy", priority: 0.3, changeFreq: "yearly" as const },
  ];

  let services: any[] = [];
  try {
    const res = await fetch(`${baseUrl}/api/signup/category-selection`);
    if (res.ok) {
      services = await res.json();
    } else {
      console.error("Failed to fetch services for sitemap");
    }
  } catch (error) {
    console.error("Error fetching services:", error);
  }

  const allRoutes = [
    ...coreRoutes,
    ...companyRoutes,
    ...legalRoutes,
    ...services.map((service: any) => ({
      path: `/services/house-cleaning`,
      priority: 0.8,
      changeFreq: "weekly" as const,
      lastMod: service.updated_at ? new Date(service.updated_at) : currentDate,
    })),
  ];

  return allRoutes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: "lastMod" in route ? route.lastMod : currentDate,
    changeFrequency: route.changeFreq,
    priority: route.priority,
  }));
}