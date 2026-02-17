import { Metadata } from "next";
import Categories from "@/components/Categories";
import CTA from "@/components/CTA";
import FeaturesPage from "@/components/Features";
import HeroSection from "@/components/Herosection";
import HowItWorks from "@/components/how-taskoria-works";
import SupportChatbot from "@/components/supportChatbox";
import Testomonail from "@/components/Testomonail";

export const metadata: Metadata = {
  title: "Taskoria | Hire Verified Professionals in Australia",
  description:"Hire verified local professionals across Australia. Post a job for free and get matched instantly with trusted trades, tech experts, cleaners and more. Transparent quotes, secure hiring.",
  
  keywords: [
    "service marketplace Australia",
    "verified service providers",
    "AI powered marketplace",
    "hire professionals Australia",
    "cleaning services",
    "web development services",
    "plumbing services",
    "home services Australia",
    "local professionals",
    "service booking platform",
    "Taskoria",
    "Australian marketplace",
    "find tradespeople",
    "instant quotes",
    "trusted service providers"
  ],

  authors: [{ name: "Taskoria" }],
  creator: "Taskoria",
  publisher: "Taskoria",

  openGraph: {
    type: "website",
    locale: "en_AU",
    url: "https://www.taskoria.com",
    siteName: "Taskoria - Australia's Trusted Service Marketplace",
    title: "Taskoria | Find Verified Service Providers in Australia",
    description: "AI-powered marketplace connecting you with 1000+ verified professionals. Get instant quotes for cleaning, trades, tech services & more. Serving 50+ cities.",
    images: [
      {
        url: "https://www.taskoria.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Taskoria - Australia's AI-Powered Service Marketplace",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Taskoria | Hire Verified Professionals in Australia",
    description: "Find verified professionals for any job. AI-powered matching, instant quotes, 4.5★ rated. Serving 50+ Australian cities.",
    images: ["https://www.taskoria.com/twitter-image.jpg"],
    creator: "@taskoria",
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

  verification: {
    google: "your-google-verification-code",
    
  },

  alternates: {
    canonical: "https://www.taskoria.com",
    languages: {
      "en-AU": "https://www.taskoria.com",
    },
  },

  category: "Business",
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.taskoria.com/#organization",
      "name": "Taskoria",
      "url": "https://www.taskoria.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.taskoria.com/taskorialogonew.png",
        "width": 250,
        "height": 60,
      },
      "description": "Australia's trusted AI-powered service marketplace.",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "AU",
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.5",
        "reviewCount": "5000",
        "bestRating": "5",
        "worstRating": "1",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://www.taskoria.com/#website",
      "url": "https://www.taskoria.com",
      "name": "Taskoria",
      "publisher": { "@id": "https://www.taskoria.com/#organization" },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://www.taskoria.com/services/{search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Service",
      "name": "Taskoria AI-Powered Marketplace",
      "serviceType": "Service Marketplace",
      "provider": { "@id": "https://www.taskoria.com/#organization" },
      "areaServed": { "@type": "Country", "name": "Australia" },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Service Categories",
        "itemListElement": [
          {
            "@type": "OfferCatalog",
            "name": "Cleaning Services",
            "itemListElement": [{ "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Home Cleaning" } }]
          },
          {
            "@type": "OfferCatalog",
            "name": "Web Development",
            "itemListElement": [{ "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Website Development" } }]
          }
        ],
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://www.taskoria.com/#breadcrumb",
      "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.taskoria.com" }],
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

      <main className="min-h-screen" role="main">
        <section aria-label="Hero section with service search">
          <HeroSection />
        </section>

        <section aria-label="How Taskoria works">
          <HowItWorks />
        </section>

        <section aria-label="Service categories">
          <Categories />
        </section>

        <section aria-label="Platform features">
          <FeaturesPage />
        </section>

        <section aria-label="Customer testimonials and reviews">
          <Testomonail />
        </section>

        <section aria-label="Get started with Taskoria">
          <CTA />
        </section>

        <SupportChatbot />
      </main>
    </>
  );
}