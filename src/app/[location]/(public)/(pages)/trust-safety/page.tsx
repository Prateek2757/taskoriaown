import TrustSafety from "@/components/Trust&safety/trust-safety";
export const dynamic = "force-static";

export const metadata = {
  title: "Trust & Safety | Taskoria",
  description:
    "Taskoria ensures safe hiring with verified providers, secure payments, and dispute protection.",
  alternates: {
    canonical: "https://www.taskoria.com/trust-safety",
  },
  openGraph: {
    title: "Trust & Safety | Taskoria",
    description:
      "Verified providers, secure payments, and protection for every job.",
    url: "https://www.taskoria.com/trust-safety",
  },
  other: {
    "article:author": "Taskoria Trust & Safety Team",
    "article:modified_time": new Date().toISOString(),
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
        text: "Every provider undergoes identity verification, ABN validation via the Australian Business Register, and licence checks relevant to their trade category before being listed on Taskoria.",
      },
    },
    {
      "@type": "Question",
      name: "Are payments on Taskoria secure?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Payments are held in escrow and only released to the provider upon job completion, in line with ACCC consumer protection guidelines for online service transactions.",
      },
    },
    {
      "@type": "Question",
      name: "What happens if there is a dispute?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Taskoria provides a structured dispute resolution process. Unresolved disputes can be escalated to your state Fair Trading office or the ACCC.",
      },
    },
  ],
};

export default function Page() {
  return (
    <>
      <TrustSafety />;
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
