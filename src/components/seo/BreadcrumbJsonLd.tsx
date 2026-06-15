"use client";

import { usePathname } from "next/navigation";

const BASE_URL = "https://www.taskoria.com";
// const LOCALE_SEGMENTS = new Set(["en", "ne"]);

const SEGMENT_LABELS: Record<string, string> = {
  about: "About",
  "about-us": "About Us",
  admin: "Admin",
  affiliates: "Affiliates",
  blog: "Blog",
  bloggs: "Blog",
  careers: "Careers",
  categories: "Categories",
  contact: "Contact",
  "cookie-policy": "Cookie Policy",
  "cost-guides": "Cost Guides",
  create: "Create",
  "create-account": "Create Account",
  customer: "Customer",
  dashboard: "Dashboard",
  "forgot-password": "Forgot Password",
  help: "Help Center",
  "help-center": "Help Center",
  "how-it-works": "How It Works",
  join: "Join",
  leads: "Leads",
  locations: "Locations",
  messages: "Messages",
  pricing: "Pricing",
  privacy: "Privacy",
  "privacy-policy": "Privacy Policy",
  provider: "Provider",
  "provider-responses": "Provider Responses",
  providerprofile: "Provider Profile",
  providers: "Providers",
  providersignupflow: "Provider Signup",
  "refund-policy": "Refund Policy",
  "refund-request": "Refund Request",
  "security-policy": "Security Policy",
  services: "Services",
  settings: "Settings",
  signin: "Sign In",
  "terms-and-conditions": "Terms and Conditions",
  "trust-safety": "Trust and Safety",
  "verification-badges": "Verification Badges",
};

function labelFromSegment(segment: string) {
  if (SEGMENT_LABELS[segment]) return SEGMENT_LABELS[segment];

  return segment
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

// function normalizePathname(pathname: string) {
//   const segments = pathname.split("/").filter(Boolean);
//   const publicSegments = LOCALE_SEGMENTS.has(segments[0])
//     ? segments.slice(1)
//     : segments;

//   return `/${publicSegments.join("/")}`;
// }

export default function BreadcrumbJsonLd() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  const itemListElement = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: BASE_URL,
    },
    ...segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join("/")}`;

      return {
        "@type": "ListItem",
        position: index + 2,
        name: labelFromSegment(segment),
        item: `${BASE_URL}${path}`,
      };
    }),
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${BASE_URL}${pathname}#breadcrumb`,
    itemListElement,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
