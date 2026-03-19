
import { Metadata } from "next";
import Categories from "@/components/Categories";
import CTA from "@/components/CTA";
import FeaturesPage from "@/components/Features";
import HeroSection from "@/components/Herosection";
import HowItWorks from "@/components/how-taskoria-works";
import Testomonail from "@/components/Testomonail";

const BASE_URL = "https://www.taskoria.com";


export const metadata: Metadata = {
  title: "Taskoria | Hire Verified Local Professionals Across Australia",
  description:
    "Find and hire trusted local professionals across Australia. Post a job free, get instant quotes from verified tradespeople, cleaners, tech experts and more. Compare reviews and book with confidence.",

  keywords: [
    "hire professionals australia",
    "local tradespeople australia",
    "verified service providers australia",
    "home services australia",
    "find tradespeople near me",
    "instant quotes australia",
    "cleaning services australia",
    "plumbing services australia",
    "electricians australia",
    "web development services australia",
    "AI powered service marketplace",
    "taskoria",
    "australian service marketplace",
    "book local professionals",
    "trusted professionals australia",
  ],

  authors:   [{ name: "Taskoria", url: BASE_URL }],
  creator:   "Taskoria",
  publisher: "Taskoria",
  category:  "Business",

  alternates: {
    canonical: BASE_URL,
    languages: {
      "en-AU":   BASE_URL,
      "x-default": BASE_URL,
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
    type:     "website",
    locale:   "en_AU",
    url:      BASE_URL,
    siteName: "Taskoria",
    title:       "Taskoria | Hire Verified Local Professionals Across Australia",
    description:
      "Connect with 1,000+ verified Australian professionals. Get instant quotes for cleaning, trades, tech and more. Serving 50+ cities nationwide.",
    images: [
      {
        url:    `${BASE_URL}/og-image.png`,
        width:  1200,
        height: 630,
        alt:    "Taskoria — Hire Verified Professionals Across Australia",
      },
    ],
  },

  twitter: {
    card:        "summary_large_image",
    title:       "Taskoria | Hire Verified Professionals Across Australia",
    description:
      "Post a job free and get matched with trusted local professionals. 4.8★ rated across 50+ Australian cities.",
    images:  [`${BASE_URL}/og-image.png`],
    creator: "@taskoria",
    site:    "@taskoria",
  },
};


const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id":   `${BASE_URL}/#organization`,
      name:    "Taskoria",
      url:     BASE_URL,
      logo: {
        "@type":  "ImageObject",
        url:      `${BASE_URL}/taskorialogonew.png`,
        width:    250,
        height:   60,
      },
      description:
        "Taskoria is Australia's trusted service marketplace connecting customers with verified local professionals for home, business, and digital services.",
      address: {
        "@type":         "PostalAddress",
        addressCountry:  "AU",
      },
      contactPoint: {
        "@type":            "ContactPoint",
        contactType:        "customer support",
        availableLanguage:  "English",
      },
      sameAs: [
        "https://www.facebook.com/taskoria",
        "https://twitter.com/taskoria",
      ],
      aggregateRating: {
        "@type":       "AggregateRating",
        ratingValue:   "4.8",
        reviewCount:   "1200",
        bestRating:    "5",
        worstRating:   "1",
      },
    },

    {
      "@type":     "WebSite",
      "@id":       `${BASE_URL}/#website`,
      url:         BASE_URL,
      name:        "Taskoria",
      inLanguage:  "en-AU",
      publisher:   { "@id": `${BASE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type":       "EntryPoint",
          urlTemplate:   `${BASE_URL}/services?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },

    {
      "@type":      "WebPage",
      "@id":        `${BASE_URL}/#webpage`,
      url:          BASE_URL,
      name:         "Taskoria | Hire Verified Local Professionals Across Australia",
      description:
        "Find and hire trusted local professionals across Australia. Get instant quotes from verified tradespeople, cleaners, tech experts and more.",
      inLanguage:   "en-AU",
      isPartOf:     { "@id": `${BASE_URL}/#website` },
      about:        { "@id": `${BASE_URL}/#organization` },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url:     `${BASE_URL}/og-image.png`,
      },
    },

    {
      "@type":       "Service",
      name:          "Taskoria — Australian Service Marketplace",
      serviceType:   "Service Marketplace",
      provider:      { "@id": `${BASE_URL}/#organization` },
      areaServed:    { "@type": "Country", name: "Australia" },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name:    "Service Categories",
        itemListElement: [
          {
            "@type": "OfferCatalog",
            name:    "Cleaning Services",
            itemListElement: [
              {
                "@type": "Offer",
                itemOffered: { "@type": "Service", name: "House Cleaning" },
              },
            ],
          },
          {
            "@type": "OfferCatalog",
            name:    "Trade Services",
            itemListElement: [
              {
                "@type": "Offer",
                itemOffered: { "@type": "Service", name: "Plumbing" },
              },
              {
                "@type": "Offer",
                itemOffered: { "@type": "Service", name: "Electrical" },
              },
            ],
          },
          {
            "@type": "OfferCatalog",
            name:    "Digital Services",
            itemListElement: [
              {
                "@type": "Offer",
                itemOffered: { "@type": "Service", name: "Web Development" },
              },
            ],
          },
        ],
      },
    },

    {
      "@type": "BreadcrumbList",
      "@id":   `${BASE_URL}/#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      ],
    },

    {
      "@context": "https://schema.org",
      "@type":    "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name:    "How does Taskoria work?",
          acceptedAnswer: {
            "@type": "Answer",
            text:   "Post your job for free on Taskoria, receive quotes from verified local professionals within minutes, compare reviews and pricing, then book directly through the platform.",
          },
        },
        {
          "@type": "Question",
          name:    "Is Taskoria available across all of Australia?",
          acceptedAnswer: {
            "@type": "Answer",
            text:   "Yes. Taskoria operates across 50+ Australian cities including Sydney, Melbourne, Brisbane, Perth, Adelaide, and surrounding suburbs.",
          },
        },
        {
          "@type": "Question",
          name:    "Are professionals on Taskoria verified?",
          acceptedAnswer: {
            "@type": "Answer",
            text:   "All professionals on Taskoria go through identity verification and background checks before they can accept jobs on the platform.",
          },
        },
        {
          "@type": "Question",
          name:    "How much does it cost to post a job on Taskoria?",
          acceptedAnswer: {
            "@type": "Answer",
            text:   "Posting a job on Taskoria is completely free. You only pay when you hire a professional.",
          },
        },
      ],
    },
  ],
};


export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <h1 className="sr-only">
        Hire Verified Local Professionals Across Australia
      </h1>

      <main className="min-h-screen" role="main">
        <section aria-label="Hero — find and hire local professionals">
          <HeroSection />

   
        </section>

        <section aria-label="How Taskoria works — step by step">
          <HowItWorks />
        </section>

        <section aria-label="Browse service categories">
          <Categories />
        </section>

        <section aria-label="Platform features and benefits">
          <FeaturesPage />
        </section>

        <section aria-label="Customer reviews and testimonials">
          <Testomonail />
        </section>

        <section aria-label="Get started — post your first job free">
          <CTA />
        </section>
      </main>
    </>
  );
}