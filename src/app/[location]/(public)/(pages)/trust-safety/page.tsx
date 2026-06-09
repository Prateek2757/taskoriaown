import type { Metadata } from "next";
import TrustSafety from "@/components/Trust&safety/trust-safety";

export const dynamic = "force-static";

const BASE_URL = "https://www.taskoria.com";

export const metadata: Metadata = {
  title: "Trust & Safety — Verified Providers & Secure Payments",
  description:
    "Learn how Taskoria protects customers with verified local service providers, secure payments, dispute support, and safer hiring across Australia.",

  keywords: [
    "Taskoria trust and safety",
    "verified service providers Australia",
    "secure payments for local services",
    "safe hiring platform Australia",
    "trusted local professionals",
    "Taskoria provider verification",
    "local services dispute protection",
    "home services safety Australia",
  ],

  alternates: {
    canonical: `${BASE_URL}/trust-safety`,
  },

  openGraph: {
    title: "Trust & Safety — Verified Providers & Secure Payments",
    description:
      "See how Taskoria helps Australians hire local service providers safely with verification, secure payments, and dispute support.",
    url: `${BASE_URL}/trust-safety`,
    siteName: "Taskoria",
    type: "website",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Taskoria trust and safety for verified local services",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Trust & Safety — Verified Providers & Secure Payments",
    description:
      "Taskoria helps make local service hiring safer with verified providers, secure payments, and dispute support.",
    images: [`${BASE_URL}/og-image.png`],
  },

  robots: {
    index: true,
    follow: true,
  },

  other: {
    "article:author": "Taskoria Trust & Safety Team",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How does Taskoria verify service providers?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Taskoria verifies service providers through identity checks, business information review, and category-relevant requirements before they can offer services on the platform.",
      },
    },
    {
      "@type": "Question",
      name: "Are payments on Taskoria secure?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Taskoria supports safer payments by helping customers and providers manage job payments through a more secure and transparent process.",
      },
    },
    {
      "@type": "Question",
      name: "What happens if there is a dispute?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Taskoria provides support for job-related issues and helps customers and providers resolve disputes through a structured review process.",
      },
    },
  ],
};

export default function Page() {
  return (
    <>
      <TrustSafety />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}