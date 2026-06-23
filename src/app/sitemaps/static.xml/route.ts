import { BASE_URL, buildUrlsetXml, xmlResponse } from "@/lib/sitemap-helpers";

export const revalidate =  604800;

export async function GET() {
  const pages = [
    { path: "/",                     priority: 1.0, changefreq: "daily"   },
    { path: "/services",             priority: 0.9, changefreq: "daily"   },
    { path: "/locations",               priority: 0.8, changefreq: "weekly"  },
    { path: "/blog",                 priority: 0.8, changefreq: "daily"   },
    { path: "/cost-guides",          priority: 0.7, changefreq: "weekly"  },
    { path: "/providers",            priority: 0.7, changefreq: "weekly"  },
    { path: "/how-it-works/customers", priority: 0.6, changefreq: "monthly" },
    { path: "/how-it-works/providers", priority: 0.6, changefreq: "monthly" },
    { path: "/about-us",             priority: 0.6, changefreq: "monthly" },
    { path: "/trust-safety",         priority: 0.7, changefreq: "monthly" },
    { path: "/careers",              priority: 0.5, changefreq: "monthly" },
    { path: "/privacy-policy",       priority: 0.3, changefreq: "yearly"  },
    { path: "/terms-and-conditions", priority: 0.3, changefreq: "yearly"  },
    { path: "/cookie-policy",        priority: 0.3, changefreq: "yearly"  },
  ];

  const xml = buildUrlsetXml(
    pages.map((p) => ({ loc: `${BASE_URL}${p.path}`, ...p }))
  );

  return xmlResponse(xml);
}
