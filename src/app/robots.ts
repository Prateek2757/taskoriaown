import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.taskoria.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/*?*utm_*',       
          '/*?callbackUrl=*', 
          '/404',            
          '/500',
        ],
      },
    
    ],
    sitemap: [`${baseUrl}/sitemap.xml`],
  }
}