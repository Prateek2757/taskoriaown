import ServiceCategoriesClient from "@/components/services/serviceCategories";
import { fetchCategories } from "@/utils/api";
import type { Metadata } from "next";

// Categories come from PostgreSQL. Render this page at request time so Docker
// builds do not require access to the production database.
export const dynamic = "force-dynamic";

const BASE_URL = "https://www.taskoria.com";
const PAGE_URL = `${BASE_URL}/services`;

interface Category {
  category_id?: string | number;
  slug: string;
  name: string;
  main_category?: string;
  hero_image?: string;
}

export async function generateMetadata(): Promise<Metadata> {
  const categories: Category[] = await fetchCategories();
  const count = categories.length;

  const title = `${count} Services in Australia — Hire Trusted Pros`;

  const description = `Browse ${count} services on Taskoria. Compare verified Australian pros, read reviews, and get free quotes for home, trade, digital, and creative work.`;

  return {
    title,
    description,

    keywords: [
      "services Australia",
      "hire professionals Australia",
      "local services Australia",
      "home services Australia",
      "verified service providers",
      "get free quotes Australia",
      "Taskoria services",
      ...categories.slice(0, 8).map((c) => `${c.name} Australia`),
    ],

    authors: [{ name: "Taskoria", url: BASE_URL }],
    creator: "Taskoria",
    publisher: "Taskoria",
    metadataBase: new URL(BASE_URL),

    alternates: {
      canonical: PAGE_URL,
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
          alt: "Browse service categories and hire trusted professionals on Taskoria Australia",
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
  const count = categories.length;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${PAGE_URL}#webpage`,
        name: `${count} Services in Australia — Hire Trusted Pros`,
        url: PAGE_URL,
        description: `Browse ${count} services on Taskoria. Compare verified Australian pros, read reviews, and get free quotes across Australia.`,
        inLanguage: "en-AU",
        isPartOf: {
          "@type": "WebSite",
          "@id": `${BASE_URL}#website`,
          name: "Taskoria",
          url: BASE_URL,
        },
        breadcrumb: {
          "@id": `${PAGE_URL}#breadcrumb`,
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${BASE_URL}/og-services.png`,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${PAGE_URL}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: BASE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Services",
            item: PAGE_URL,
          },
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${PAGE_URL}#services-list`,
        name: "Service Categories on Taskoria",
        description: `Browse ${count} service categories and hire trusted professionals across Australia.`,
        url: PAGE_URL,
        numberOfItems: count,
        itemListElement: categories.map((cat, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: cat.name,
          url: `${BASE_URL}/services/${cat.slug}`,
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
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
        Browse {count} Service Categories Across Australia
      </h1>

      <ServiceCategoriesClient categories={categories} />
    </>
  );
}
