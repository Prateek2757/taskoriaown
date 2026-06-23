import { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/sitemap-helpers";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/*?*utm_*",
          "/*?*callbackUrl=*",
          "/*?*ref=*",
          "/*?*user_id=*",
          "/*?*cn=*",
          "/*?*q=*",
          "/*?*gclid=*",
          "/*?*fbclid=*",
          "/404",
          "/500",
        ],
      },
    ],
    sitemap: [`${BASE_URL}/sitemap.xml`],
  };
}
