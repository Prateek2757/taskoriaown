import ProvidersGrid from "@/components/providers/provider-list";
import { fetchProviders } from "@/utils/api";
import { Metadata } from "next";
import { Suspense } from "react";

export async function generateMetadata(): Promise<Metadata> {
  const providers = await fetchProviders();
  const count = providers.length;

  return {
    title: `Service Providers (${count}) — Find Local Experts | Taskoria`,
    description: `Browse ${count} verified service providers on Taskoria. Find top-rated professionals by name, service, or location. Read reviews and hire with confidence.`,
    alternates: {
      canonical: "https://www.taskoria.com/providers",
    },
    openGraph: {
      title: `Service Providers — Find Local Experts | Taskoria`,
      description: `Browse ${count} verified service providers on Taskoria. Find top-rated professionals by name, service, or location.`,
      url: "https://www.taskoria.com/providers",
      siteName: "Taskoria",
      type: "website",
    },
  };
}

export default async function ProvidersPage() {
  const providers = await fetchProviders();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Service Providers on Taskoria",
    numberOfItems: providers.length,
    itemListElement: providers.map((p: any, index: number) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "LocalBusiness",
        name: p.name,
        url: `https://www.taskoria.com/providerprofile/${p.public_id}`,
        image: p.image ?? undefined,
        description: p.description ?? `${p.name} offers ${p.services?.slice(0, 2).join(", ")} on Taskoria.`,
        ...(p.rating && {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: p.rating,
            reviewCount: p.review_count ?? 1,
          },
        }),
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={null}>
        <ProvidersGrid providers={providers} />
      </Suspense>
    </>
  );
}