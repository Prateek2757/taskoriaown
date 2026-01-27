import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  const staticPages = [
    { url: 'https://taskoria.com', lastModified: new Date() },
    { url: 'https://taskoria.com/about-us', lastModified: new Date() },
    { url: 'https://taskoria.com/create', lastModified: new Date() },
    { url: 'https://taskoria.com/trust-safety', lastModified: new Date() },
    { url: 'https://taskoria.com/privacy-policy', lastModified: new Date() },
    { url: 'https://taskoria.com/cookie-policy', lastModified: new Date() },
    { url: 'https://taskoria.com/terms-and-conditions', lastModified: new Date() },
    { url: 'https://taskoria.com/careers', lastModified: new Date() },
    { url: 'https://taskoria.com/provider-responses/*', lastModified: new Date() },
    { url: 'https://taskoria.com/services/*', lastModified: new Date() },
  ]
  return [...staticPages]
} 