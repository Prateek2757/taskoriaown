import type { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/provider/*'
    },
    sitemap: 'https://taskoria.com/sitemap.xml',
  }
}