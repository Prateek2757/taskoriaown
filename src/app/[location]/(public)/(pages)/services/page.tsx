import ServiceCategoriesClient from "@/components/services/serviceCategories";
import { fetchCategories } from "@/utils/api";
import { Metadata } from "next";

const BASE_URL = "https://www.taskoria.com";
const PAGE_URL = `${BASE_URL}/services`;

interface Category {
  category_id?:string | number;
  slug: string;
  name: string;
  main_category?:string;
  hero_image?: string;
}


export async function generateMetadata(): Promise<Metadata> {
  const categories: Category[] = await fetchCategories();
  const count = categories.length;

  const title = `Hire Trusted Pros Across ${count} Services in Australia`;
  const description = `Browse ${count} service categories on Taskoria — from home cleaning and trades to digital and creative work. Compare verified Australian professionals, read real reviews and get free quotes instantly.`;

  return {
    title,
    description,
    keywords: [
      "services australia",
      "hire professionals australia",
      "local tradespeople australia",
      "home services australia",
      "find professionals near me",
      "verified service providers",
      "get free quotes australia",
      "taskoria services",
      ...categories.slice(0, 10).map((c) => `${c.name.toLowerCase()} australia`),
    ].join(", "),

    authors:   [{ name: "Taskoria", url: BASE_URL }],
    creator:   "Taskoria",
    publisher: "Taskoria",

    alternates: {
      canonical: PAGE_URL,
      languages: {
        "en-AU":   PAGE_URL,
        "x-default": PAGE_URL,
      },
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    openGraph: {
      title,
      description,
      url: PAGE_URL,
      siteName: "Taskoria",
      locale: "en_AU",
      type: "website",
      images: [
        {
          url: `${BASE_URL}/og-services.png`,
          width: 1200,
          height: 630,
          alt: "Browse All Service Categories on Taskoria Australia",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${BASE_URL}/og-services.png`],
      creator: "@taskoria",
      site: "@taskoria",
    },
  };
}


export default async function ServicesPage() {
  const categories: Category[] = await fetchCategories();

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Service Categories on Taskoria",
    description: `Browse ${categories.length} service categories and hire trusted professionals across Australia.`,
    url: PAGE_URL,
    numberOfItems: categories.length,
    itemListElement: categories.map((cat, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: cat.name,
      url: `${BASE_URL}/services/${cat.slug}`
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",     item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Services", item: PAGE_URL },
    ],
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Browse All Service Categories | Taskoria Australia",
    url: PAGE_URL,
    description: `Browse ${categories.length} service categories and hire trusted verified professionals across Australia on Taskoria.`,
    inLanguage: "en-AU",
    isPartOf: { "@type": "WebSite", name: "Taskoria", url: BASE_URL },
    breadcrumb: breadcrumbSchema,
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: `${BASE_URL}/og-services.png`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />

      <nav
        aria-label="Breadcrumb"
        className="sr-only"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        <span
          itemProp="itemListElement"
          itemScope
          itemType="https://schema.org/ListItem"
        >
          <a itemProp="item" href="/">
            <span itemProp="name">Home</span>
          </a>
          <meta itemProp="position" content="1" />
        </span>
        <span
          itemProp="itemListElement"
          itemScope
          itemType="https://schema.org/ListItem"
        >
          <a itemProp="item" href="/services">
            <span itemProp="name">Services</span>
          </a>
          <meta itemProp="position" content="2" />
        </span>
      </nav>

   
      <h1 className="sr-only">
        Browse {categories.length} Service Categories Across Australia
      </h1>

    <ServiceCategoriesClient categories={categories} />
    </>
  );
}