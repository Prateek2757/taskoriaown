import type { Metadata } from "next";
import { lazy, Suspense } from "react";

import HeroSection from "@/components/HeroSection/Herosection";
import HomepageStatsCounter from "@/components/HomepageStatsCounter";
import InternalLinkModule from "@/components/InternalLinkModule";
import HomepageCityCoverage from "@/components/HomepageCityCoverage";

import {
  getPriorityCityLinks,
  getPriorityServiceLinks,
} from "@/lib/internal-links";

import {
  getCategoriesFromDB,
  getPopularSeoCitiesFromDB,
} from "@/lib/cache";

import { filterSeoLocations } from "@/lib/seo-locations";

import {
  BASE_URL,
  LEGAL_NAME,
  ABN,
  LOGO,
  OG_IMAGE,
  SITE_NAME,
  TWITTER_HANDLE,
} from "./layout";

/* -------------------------------------------------------------------------- */
/*                         HOMEPAGE RENDERING MODE                            */
/* -------------------------------------------------------------------------- */

/**
 * Your homepage reads service/category/city information from the database.
 *
 * Cloud Run has database access at runtime, while your Docker build may not.
 * Keeping force-dynamic avoids requiring those database queries during build.
 */
export const dynamic = "force-dynamic";

/* -------------------------------------------------------------------------- */
/*                              LAZY COMPONENTS                               */
/* -------------------------------------------------------------------------- */

const HowTaskoriaWorks = lazy(
  () => import("@/components/how-taskoria-works")
);

const PopularServicesSection = lazy(
  () => import("@/components/PopularServicesSection")
);

const FeaturesPage = lazy(
  () => import("@/components/Features")
);

const CustomersReview = lazy(
  () => import("@/components/CustomersReview")
);

const HomepageFAQ = lazy(
  () => import("@/components/HomepageFAQ")
);

const PlatformReachTicker = lazy(
  () => import("@/components/PlatformReachTicker")
);

const CTA = lazy(
  () => import("@/components/CTA")
);

/* -------------------------------------------------------------------------- */
/*                              HOMEPAGE METADATA                             */
/* -------------------------------------------------------------------------- */

export const metadata: Metadata = {
  title: {
    absolute:
      "Taskoria | Find Trusted Local Professionals Across Australia",
  },

  description:
    "Find trusted local professionals across Australia with Taskoria. Compare quotes for cleaning, plumbing, electrical, gardening, removals, digital services and more.",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",

    locale: "en_AU",

    url: "/",

    siteName: SITE_NAME,

    title:
      "Taskoria | Find Trusted Local Professionals Across Australia",

    description:
      "Find trusted local professionals across Australia. Compare quotes for home, trade, business and digital services.",

    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Taskoria - Find Trusted Local Professionals Across Australia",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title:
      "Taskoria | Find Trusted Local Professionals Across Australia",

    description:
      "Find and compare trusted local professionals across Australia with Taskoria.",

    images: [OG_IMAGE],

    creator: TWITTER_HANDLE,
    site: TWITTER_HANDLE,
  },
};


const homepageJsonLd = {
  "@context": "https://schema.org",

  "@graph": [
  
    {
      "@type": "Organization",

      "@id": `${BASE_URL}/#organization`,

      name: SITE_NAME,

      alternateName: "Taskoria Australia",

      legalName: LEGAL_NAME,

      url: BASE_URL,

      logo: {
        "@type": "ImageObject",

        "@id": `${BASE_URL}/#logo`,

        url: LOGO,
      },

      image: OG_IMAGE,

      taxID: ABN,

      email: "contact@taskoria.com",

      telephone: "+61 1300 531 727",

      contactPoint: [
        {
          "@type": "ContactPoint",

          telephone: "+61 1300 531 727",

          email: "contact@taskoria.com",

          contactType: "customer support",

          areaServed: {
            "@type": "Country",
            name: "Australia",
          },

          availableLanguage: ["English"],
        },
      ],

      areaServed: {
        "@type": "Country",
        name: "Australia",
      },

      sameAs: [
        "https://www.instagram.com/taskoria.au/",
        "https://www.tiktok.com/@taskoria",
        "https://x.com/taskoria",
        "https://www.linkedin.com/company/taskoria-au",
        "https://www.trustpilot.com/review/taskoria.com",
      ],
    },

    
    {
      "@type": "WebSite",

      "@id": `${BASE_URL}/#website`,

      url: BASE_URL,

      name: SITE_NAME,

      alternateName: [
        "Taskoria Australia",
        "taskoria.com",
      ],

      description:
        "Taskoria is an Australian service marketplace connecting customers with local professionals.",

      publisher: {
        "@id": `${BASE_URL}/#organization`,
      },

      inLanguage: "en-AU",
    },

  
    {
      "@type": "WebPage",

      "@id": `${BASE_URL}/#webpage`,

      url: BASE_URL,

      name:
        "Taskoria | Find Trusted Local Professionals Across Australia",

      description:
        "Find trusted local professionals across Australia with Taskoria. Compare quotes for home, trade, business and digital services.",

      isPartOf: {
        "@id": `${BASE_URL}/#website`,
      },

      about: {
        "@id": `${BASE_URL}/#organization`,
      },

      primaryImageOfPage: {
        "@id": `${BASE_URL}/#primaryimage`,
      },

      inLanguage: "en-AU",
    },

    {
      "@type": "ImageObject",

      "@id": `${BASE_URL}/#primaryimage`,

      url: OG_IMAGE,

      contentUrl: OG_IMAGE,

      caption:
        "Taskoria - Find Trusted Local Professionals Across Australia",
    },

  
    {
      "@type": "Service",

      "@id": `${BASE_URL}/#service`,

      name: "Taskoria Local Services Marketplace",

      description:
        "Taskoria connects customers across Australia with local professionals for home, trade, business and digital services.",

      serviceType:
        "Local professional services marketplace",

      provider: {
        "@id": `${BASE_URL}/#organization`,
      },

      areaServed: {
        "@type": "Country",
        name: "Australia",
      },

      url: BASE_URL,
    },
  ],
};


function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export default async function HomePage() {
  /**
   * Fetch both datasets in parallel.
   */
  // const [services, cities] = await Promise.all([
  //   getCategoriesFromDB(),
  //   getPopularSeoCitiesFromDB(80),
  // ]);

  // /**
  //  * Select the most important crawlable internal links.
  //  */
  // const serviceLinks =
  //   getPriorityServiceLinks(services, 8);

  // const cityLinks =
  //   getPriorityCityLinks(
  //     filterSeoLocations(cities),
  //     8
  //   );

  return (
    <>
    

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(homepageJsonLd),
        }}
      />

     

      <main id="main-content">
      

        <section
          aria-label="Find and hire local professionals"
        >
          <HeroSection />
        </section>


        <Suspense
          fallback={
            <div
              className="min-h-12.5"
              aria-hidden="true"
            />
          }
        >
          <section
            aria-label="Browse popular service categories"
          >
            <PopularServicesSection />
          </section>
        </Suspense>


        {/*
          IMPORTANT:

          Keep these links visible to normal users.

          Do NOT render these only for Googlebot.
          Do NOT use CSS to hide these only for SEO.
        */}

        {/* {(serviceLinks.length > 0 ||
          cityLinks.length > 0) && (
          <InternalLinkModule
            eyebrow="Popular on Taskoria"
            title="Find trusted professionals across Australia"
            description="Browse popular services and locations to find local professionals and compare quotes."
            groups={[
              {
                title: "Popular services",
                links: serviceLinks,
              },
              {
                title: "Popular locations",
                links: cityLinks,
              },
            ]}
            className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
          />
        )} */}


        <Suspense
          fallback={
            <div
              className="min-h-12.5"
              aria-hidden="true"
            />
          }
        >
          <section
            aria-label="How Taskoria works"
          >
            <HowTaskoriaWorks />
          </section>
        </Suspense>

        <Suspense
          fallback={
            <div
              className="min-h-12.5"
              aria-hidden="true"
            />
          }
        >
          <section
            aria-label="Taskoria marketplace statistics"
          >
            <HomepageStatsCounter />
          </section>
        </Suspense>

     

        <Suspense
          fallback={
            <div
              className="min-h-12.5"
              aria-hidden="true"
            />
          }
        >
          <section
            aria-label="Taskoria features and benefits"
          >
            <FeaturesPage />
          </section>
        </Suspense>

      
        <Suspense
          fallback={
            <div
              className="min-h-12.5"
              aria-hidden="true"
            />
          }
        >
          <section
            aria-label="Customer reviews"
          >
            <CustomersReview />
          </section>
        </Suspense>

      
        <Suspense
          fallback={
            <div
              className="min-h-12.5"
              aria-hidden="true"
            />
          }
        >
          <section
            aria-label="Taskoria service locations across Australia"
          >
            <HomepageCityCoverage />
          </section>
        </Suspense>


        <Suspense
          fallback={
            <div
              className="min-h-12.5"
              aria-hidden="true"
            />
          }
        >
          <section
            aria-label="Frequently asked questions"
          >
            <HomepageFAQ />
          </section>
        </Suspense>

       

        <Suspense
          fallback={
            <div
              className="min-h-12.5"
              aria-hidden="true"
            />
          }
        >
          <section
            aria-label="Taskoria platform reach"
          >
            <PlatformReachTicker />
          </section>
        </Suspense>


        <Suspense
          fallback={
            <div
              className="min-h-12.5"
              aria-hidden="true"
            />
          }
        >
          <section
            aria-label="Get started with Taskoria"
          >
            <CTA />
          </section>
        </Suspense>
      </main>
    </>
  );
}