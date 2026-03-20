import ProviderProfileClient from "@/components/providers/ProviderIndividual/ProviderProfileClient";
import { fetchProviders } from "@/utils/api";
import { Metadata } from "next";
import { notFound } from "next/navigation";

function isProfileComplete(provider: any): boolean {
  return !!(
    provider.name &&
    provider.profile_services?.length > 0   );
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { id } = await params;
  const providers = await fetchProviders();
  const provider = providers.find((p: any) => String(p.public_id) === id);

  if (!provider) {
    return {
      title: "Provider Not Found — Taskoria",
      robots: { index: false, follow: false },
    };
  }

  const complete = isProfileComplete(provider);
  const primaryService = provider.services?.[0] ?? "Professional";
  const primaryCategory = provider.categories?.[0] ?? "Services";
  const location = provider.service_areas?.[0] ?? "";

  const title = `${provider.name} — ${primaryService} ${primaryCategory} Provider${location ? ` in ${location}` : ""} | Taskoria`;
  const description =
  provider.description ||
  `Hire ${provider.name} on Taskoria for ${primaryService} services. View ratings, reviews, availability, and service areas.`;

  return {
    title,
    description,

    robots: complete
      ? { index: true, follow: true }
      : { index: false, follow: false },

    alternates: {
      canonical: `https://www.taskoria.com/providerprofile/${id}`,
    },

    openGraph: {
      title,
      description,
      url: `https://www.taskoria.com/providerprofile/${id}`,
      siteName: "Taskoria",
      images: provider.image
        ? [{ url: provider.image, alt: `${provider.name} profile photo` }]
        : [],
      type: "profile",
    },

  };
}

export default async function ProviderPage({ params }: any) {
  const { id } = await params;
  const providers = await fetchProviders();
  const provider = providers.find((p: any) => String(p.public_id) === id);

  if (!provider) notFound();


  const complete = isProfileComplete(provider);
  const primaryService = provider.profile_services?.[0] ?? "Professional";
  let location: string | undefined;
  if (provider.locationname) {
    location = provider.locationname;
  } else if (provider.nationwide) {
    location = "Australia"; 
  }
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: provider.name,
    description: provider.description,
    image: provider.image ?? undefined,
    url: `https://www.taskoria.com/providerprofile/${id}`,
    ...(location && {
      areaServed: {
        "@type": "Place",
        name: location,
      },
    }),    ...(provider.rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: provider.rating,
        reviewCount: provider.review_count ?? 1,
      },
    }),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${primaryService} Services`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProviderProfileClient provider={provider}  />
    </>
  );
}