import { Metadata } from "next";
import { lazy, Suspense } from "react";
import HeroSection from "@/components/HeroSection/Herosection";
import HomepageStatsCounter from "@/components/HomepageStatsCounter";
import Script from "next/script";
import { BASE_URL, LOGO, OG_IMAGE, SITE_NAME, TWITTER_HANDLE } from "./layout";
import InternalLinkModule from "@/components/InternalLinkModule";
import {
  getPriorityCityLinks,
  getPriorityServiceLinks,
} from "@/lib/internal-links";
import PlatformReachTicker from "@/components/PlatformReachTicker";
import HomepageCityCoverage from "@/components/HomepageCityCoverage";

const HowTaskoriaWorks = lazy(() => import("@/components/how-taskoria-works"));
// const Categories = lazy(() => import("@/components/Categories"));
const PopularServicesSection = lazy(
  () => import("@/components/PopularServicesSection")
);
const FeaturesPage = lazy(() => import("@/components/Features"));
const Testomonail = lazy(() => import("@/components/Testomonail"));
const HomepageFAQ = lazy(() => import("@/components/HomepageFAQ"));
const CTA = lazy(() => import("@/components/CTA"));
const CustomersReview = lazy(() => import("@/components/CustomersReview"));

export const metadata: Metadata = {
  title: {
    absolute: "Connect with Local Experts & Earn Money Easily | Taskoria",
  },
  description:
    "Find trusted, verified local professionals across Australia. Get free quotes, compare services, and hire with confidence on Taskoria — fast, easy, and reliable.",

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

  authors: [{ name: SITE_NAME, url: BASE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "Business",

  alternates: {
    canonical: BASE_URL,
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
    type: "website",
    locale: "en_AU",
    url: BASE_URL,
    siteName: SITE_NAME,
    title: "Hire Verified Local Professionals Across Australia | Taskoria",
    description:
      "Connect with 1,000+ verified Australian professionals. Get instant quotes for cleaning, trades, tech and more. Serving 50+ cities nationwide.",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Taskoria — Hire Verified Professionals Across Australia",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Taskoria | Hire Verified Professionals Across Australia",
    description:
      "Post a job free and get matched with trusted local professionals. 4.8★ rated across 50+ Australian cities.",
    images: [OG_IMAGE],
    creator: TWITTER_HANDLE,
    site: TWITTER_HANDLE,
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: SITE_NAME,
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: LOGO,
        width: 250,
        height: 60,
      },
      description:
        "Taskoria is Australia's trusted service marketplace connecting customers with verified local professionals for home, business, and digital services.",
      address: {
        "@type": "PostalAddress",
        addressCountry: "AU",
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        availableLanguage: "English",
      },
      sameAs: [
        "https://www.facebook.com/taskoria",
        "https://twitter.com/taskoria",
      ],
  
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.7",
        reviewCount: "120",
        bestRating: "5",
        worstRating: "1",
      },
    },

    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
      name: SITE_NAME,
      inLanguage: "en-AU",
      publisher: { "@id": `${BASE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${BASE_URL}/services?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },

    {
      "@type": "WebPage",
      "@id": `${BASE_URL}/#webpage`,
      url: BASE_URL,
      name: "Hire Verified Local Professionals Across Australia | Taskoria",
      description:
        "Find and hire trusted local professionals across Australia. Get instant quotes from verified tradespeople, cleaners, tech experts and more.",
      inLanguage: "en-AU",
      isPartOf: { "@id": `${BASE_URL}/#website` },
      about: { "@id": `${BASE_URL}/#organization` },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: OG_IMAGE,
      },
    },

    {
      "@type": "Service",
      name: "Taskoria — Australian Service Marketplace",
      serviceType: "Service Marketplace",
      provider: { "@id": `${BASE_URL}/#organization` },
      areaServed: { "@type": "Country", name: "Australia" },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Service Categories",
        itemListElement: [
          {
            "@type": "OfferCatalog",
            name: "Cleaning Services",
            itemListElement: [
              {
                "@type": "Offer",
                itemOffered: { "@type": "Service", name: "House Cleaning" },
              },
            ],
          },
          {
            "@type": "OfferCatalog",
            name: "Trade Services",
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
            name: "Digital Services",
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
      "@id": `${BASE_URL}/#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      ],
    },

    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Is Taskoria free to use?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Customers can post a job and receive quotes for free. You only pay when you choose a professional and agree to move ahead with the work.",
          },
        },
        {
          "@type": "Question",
          name: "Are professionals on Taskoria verified?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Taskoria asks professionals to complete verification checks before they respond to customer jobs. Profiles can also include business details, licences, accreditations, reviews, and past work so customers can compare with confidence.",
          },
        },
        {
          "@type": "Question",
          name: "How fast will I receive quotes?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Many customers receive their first responses within minutes. Timing can vary by service, location, and job detail, but common jobs often attract multiple quotes within a few hours.",
          },
        },
        {
          "@type": "Question",
          name: "Where in Australia does Taskoria operate?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Taskoria supports customers across Australia, including major cities, regional centres, and surrounding suburbs. Availability can vary by service category and local provider coverage.",
          },
        },
        {
          "@type": "Question",
          name: "What services can I book on Taskoria?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Customers can request quotes for home cleaning, plumbing, electrical work, gardening, removals, rubbish removal, events, tutoring, digital services, design, and many other local or professional jobs.",
          },
        },
      ],
    },
  ],
};

export default function HomePage() {
  const serviceLinks = getPriorityServiceLinks(undefined, 8);
  const cityLinks = getPriorityCityLinks(undefined, 8);

  return (
    <>

      <Script
        id="homepage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

    
      <main className="" role="main">
        <section aria-label="Hero — find and hire local professionals">
          <HeroSection />
        </section>

        {/* <HomepageStatsCounter /> */}

        <Suspense fallback={<div className="min-h-12.5" />}>
          <section aria-label="Browse service categories">
            <PopularServicesSection />
          </section>
        </Suspense>

        {/* <InternalLinkModule
          title="Popular services and cities"
          description="Start with Taskoria's priority service and city pages, then narrow your search by service area."
          groups={[
            { title: "Priority services", links: serviceLinks },
            { title: "Priority cities", links: cityLinks },
          ]}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        /> */}

        <Suspense fallback={<div className="min-h-12.5" />}>
          <section aria-label="How Taskoria works — step by step">
            <HowTaskoriaWorks />
          </section>
        </Suspense>
        <Suspense fallback={<div className="min-h-12.5" />}>
          <section aria-label="How Taskoria works — step by step">
            <HomepageStatsCounter />
          </section>
        </Suspense>

        <Suspense fallback={<div className="min-h-12.5" />}>
          <section aria-label="Platform features and benefits">
            <FeaturesPage />
          </section>
        </Suspense>

        <Suspense fallback={<div className="min-h-12.5" />}>
          <section aria-label="Customer reviews and testimonials">
            <CustomersReview />
          </section>
        </Suspense>

        <Suspense fallback={<div className="min-h-12.5" />}>
          <HomepageCityCoverage />
        </Suspense>

        <Suspense fallback={<div className="min-h-12.5" />}>
          <HomepageFAQ />
        </Suspense>

        <Suspense fallback={<div className="min-h-12.5" />}>
          <PlatformReachTicker />
        </Suspense>

        <Suspense fallback={<div className="min-h-12.5" />}>
          <section aria-label="Get started — post your first job free">
            <CTA />
          </section>
        </Suspense>
        
      </main>
    </>
  );
}
