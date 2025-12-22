import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  const staticPages = [
    { url: 'https://taskoria.com', lastModified: new Date() },
    { url: 'https://taskoria.com/about', lastModified: new Date() },
    { url: 'https://taskoria.com/contact', lastModified: new Date() },
  ]



  return [...staticPages, ]
}