import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.taskoria.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/provider/dashboard',
          '/provider/message',
          '/provider/leads',
          '/customer/dashboard',
          '/messages/',
          '/signin',
          '/signup',
          '/*?callbackUrl=*', 
          '/*?*utm_*',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/provider/dashboard',
          '/customer/dashboard',
        ],
        crawlDelay: 0,
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/provider/dashboard',
          '/customer/dashboard',
        ],
        crawlDelay: 0,
      }
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
   
    ],
  }
}