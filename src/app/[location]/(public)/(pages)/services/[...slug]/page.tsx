import ServicePageWrapper from "@/components/servicePage/ServicePageWrapper";
import ServiceStatePageClient from "@/components/servicePage/Servicestatepageclient";
import StructuredData from "@/components/servicePage/StructureData";
import {
  getAllCities,
  getCategoriesFromDB,
  getCategoryBySlug,
} from "@/lib/cache";
import { Metadata } from "next";
import { notFound } from "next/navigation";
export const dynamic = "force-static";
export const revalidate = 604800;

type Props = {
  params: Promise<{ slug?: string[] }>;
};

interface ServiceData {
  category_id: number;
  name: string;
  description?: string;
  hero_image?: string;
  about?: string;
  service_detail?: string;
  slug?: string;
  faqs?: { question: string; answer: string }[];
}

export interface City {
  city_id: number;
  name: string;
  slug: string;
  display_name: string | null;
  popularity: number;
  latitude: number | undefined;
  longitude: number | undefined;
  image_url: string | null;
  state_slug: string;
  state_name: string;
  country_name: string;
  subcities: { city_id: number; name: string; slug: string }[];
  providers?: any[];
}

function toTitleCase(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

function buildCanonical(
  serviceSlug: string,
  stateSlug: string | null,
  citySlug: string | null,
  subCitySlug: string | null
) {
  const base = `https://www.taskoria.com/services/${serviceSlug}`;

  if (stateSlug && citySlug && subCitySlug) {
    return `${base}/${stateSlug}/${citySlug}/${subCitySlug}`;
  }

  if (stateSlug && citySlug) {
    return `${base}/${stateSlug}/${citySlug}`;
  }

  if (stateSlug) {
    return `${base}/${stateSlug}`;
  }

  return base;
}

// async function getService(serviceSlug: string): Promise<ServiceData | null> {
//   try {
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_APP_URL}/api/categories/${serviceSlug}`,
//       { next: { revalidate: 84600 } }
//     );
//     return res.ok ? res.json() : null;
//   } catch {
//     return null;
//   }
// }
async function getService(serviceSlug: string) {
  return await getCategoryBySlug(serviceSlug);
}

// async function getAllCities(): Promise<City[]> {
//   try {
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_APP_URL}/api/service-location`,
//       { next: { revalidate: 3600 } }
//     );
//     return res.ok ? res.json() : [];
//   } catch {
//     return [];
//   }
// }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug = [] } = await params;
  const [serviceSlug, stateSlug = null, citySlug = null, subCitySlug = null] =
    slug;

  if (!serviceSlug) {
    return {
      title: "Professional Services Near You | Taskoria",
      description:
        "Find and book trusted local professionals with Taskoria. Get free quotes, compare prices, and read verified reviews.",
    };
  }

  const service = await getService(serviceSlug);
  if (!service) {
    return {
      title: "Service Not Found | Taskoria",
      robots: { index: false, follow: false },
    };
  }

  const cityName = citySlug ? toTitleCase(citySlug) : null;
  const stateName = stateSlug ? toTitleCase(stateSlug) : null;
  const isStatePage = stateSlug && !citySlug;
  const canonicalUrl = buildCanonical(
    serviceSlug,
    stateSlug,
    citySlug,
    subCitySlug
  );
  const imageUrl =
    service.hero_image ??
    `https://www.taskoria.com/og-images/${serviceSlug}.jpg`;

  const title = cityName
    ? `Hire ${service.name} in ${cityName} | Get Free Quotes`
    : isStatePage
      ? `Find ${service.name} in ${stateName} | Trusted Professionals | Taskoria`
      : `Find trusted ${service.name} near you | Free quotes`;

  const description = cityName
    ? `Looking for reliable ${service.name.toLowerCase()} in ${cityName}? Compare verified professionals, read real reviews and get free quotes fast on Taskoria.`
    : isStatePage
      ? `Find trusted ${service.name.toLowerCase()} professionals across ${stateName}. Compare verified providers, read real reviews and get instant free quotes on Taskoria.`
      : service.description
        ? `${service.description.slice(0, 130).trimEnd()}. Get free quotes from verified professionals across Australia – only on Taskoria.`
        : `Hire trusted ${service.name.toLowerCase()} professionals across Australia. Compare verified providers, read reviews and get instant free quotes on Taskoria.`;

  const keywords = cityName
    ? [
        `${service.name.toLowerCase()} ${cityName}`,
        `${service.name.toLowerCase()} in ${cityName}`,
        `${cityName} ${service.name.toLowerCase()} services`,
        `hire ${service.name.toLowerCase()} ${cityName}`,
        `best ${service.name.toLowerCase()} ${cityName}`,
        `${service.name.toLowerCase()} near me`,
        `${service.name.toLowerCase()} quotes ${cityName}`,
        ...(stateName ? [`${service.name.toLowerCase()} ${stateName}`] : []),
      ].join(", ")
    : isStatePage
      ? [
          `${service.name.toLowerCase()} ${stateName}`,
          `${service.name.toLowerCase()} in ${stateName}`,
          `${stateName} ${service.name.toLowerCase()} services`,
          `hire ${service.name.toLowerCase()} ${stateName}`,
          `best ${service.name.toLowerCase()} ${stateName}`,
          `${service.name.toLowerCase()} near me`,
        ].join(", ")
      : [
          `${service.name.toLowerCase()} australia`,
          `${service.name.toLowerCase()} services australia`,
          `hire ${service.name.toLowerCase()} australia`,
          `${service.name.toLowerCase()} near me`,
          `${service.name.toLowerCase()} quotes`,
          `professional ${service.name.toLowerCase()}`,
        ].join(", ");

  return {
    title,
    description,
    keywords,
    authors: [{ name: "Taskoria", url: "https://www.taskoria.com" }],
    creator: "Taskoria",
    publisher: "Taskoria",
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
      type: "website",
      locale: "en_AU",
      url: canonicalUrl,
      siteName: "Taskoria",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: cityName
            ? `${service.name} in ${cityName}`
            : stateName
              ? `${service.name} in ${stateName}`
              : `${service.name} Services in Australia`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
      creator: "@taskoria",
      site: "@taskoria",
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "en-AU": canonicalUrl,
        "x-default": `https://www.taskoria.com/services/${serviceSlug}`,
      },
    },
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug = [] } = await params;
  const [serviceSlug, stateSlug = null, citySlug = null, subCitySlug = null] =
    slug;

  if (!serviceSlug || serviceSlug === "undefined") notFound();

  const [service, cities] = await Promise.all([
    getService(serviceSlug),
    getAllCities(),
  ]);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Service Not Found
          </h1>
          <p className="mt-2 text-gray-500">
            We couldn&apos;t find the service you&apos;re looking for.
          </p>
        </div>
      </div>
    );
  }
  if (stateSlug && !citySlug) {
    const stateName = toTitleCase(stateSlug);
    const stateCitiesRaw = cities
      .filter((c) => c.state_slug === stateSlug)
      .sort((a, b) => b.popularity - a.popularity);
    const stateCities = Array.from(
      new Map(stateCitiesRaw.map((c) => [c.name.toLowerCase(), c])).values()
    );
    if (!stateCities.length) notFound();

    const otherStates = [
      ...new Map(
        cities
          .filter((c) => c.state_slug !== stateSlug)
          .map((c) => [
            c.state_slug,
            { state_slug: c.state_slug, state_name: c.state_name },
          ])
      ).values(),
    ].sort((a, b) => a.state_name.localeCompare(b.state_name));

    return (
      <>
        <h1 className="sr-only">
          Find {service.name} in {stateName}
        </h1>
        <StructuredData
          service={service}
          city={null}
          citySlug={null}
          stateSlug={stateSlug}
          providers={[]}
        />
        <ServiceStatePageClient
          service={service}
          stateName={stateName}
          stateSlug={stateSlug}
          cities={stateCities}
          otherStates={otherStates}
        />
      </>
    );
  }

  const selectedLocation = citySlug
    ? (cities.find((city) => city.slug === citySlug) ?? null)
    : null;

  const selectedSubCity = subCitySlug
    ? (selectedLocation?.subcities?.find((s) => s.slug === subCitySlug) ?? null)
    : null;

  const activeLocation = selectedSubCity ?? selectedLocation;

  return (
    <>
      <h1 className="sr-only">
        {citySlug
          ? `Hire ${service.name} in ${toTitleCase(citySlug)}`
          : `Find trusted ${service.name} near you`}
      </h1>
      <StructuredData
        service={service}
        city={selectedLocation}
        citySlug={citySlug}
        stateSlug={stateSlug}
        providers={selectedLocation?.providers || []}
      />
      <ServicePageWrapper
        service={service}
        cities={cities}
        initialLocation={activeLocation}
        citySlug={citySlug}
        stateSlug={stateSlug}
        subCitySlug={subCitySlug}
      />
    </>
  );
}

export async function generateStaticParams() {
  try {
    const [cities, categoriesRaw] = await Promise.all([
      getAllCities(),
      getCategoriesFromDB(),
    ]);

    const params: { slug: string[] }[] = [];

    const rankedCategories = categoriesRaw
      .filter((c) =>  c.slug && c.rank != null) 
      .sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999));

    const rankedCities = [...cities]
      .filter((c) => c.popularity > 0 && c.slug && c.state_slug) 
      .sort((a, b) => b.popularity - a.popularity)
      .filter((c, i, arr) => arr.findIndex((x) => x.slug === c.slug) === i); 

    const uniqueStates = [
      ...new Map(
        rankedCities.map((c) => [c.state_slug, c.state_slug])
      ).values(),
    ];

    for (const cat of rankedCategories) {
      params.push({ slug: [cat.slug!] });
    }

    for (const cat of rankedCategories) {
      for (const stateSlug of uniqueStates) {
        params.push({ slug: [cat.slug!, stateSlug] });
      }
    }

    for (const cat of rankedCategories) {
      for (const city of rankedCities) {
        params.push({ slug: [cat.slug!, city.state_slug, city.slug] });
      }
    }

    console.log(`[generateStaticParams]
      ranked categories : ${rankedCategories.length}  (unranked skipped: ${categoriesRaw.filter(c => !c.parent_category_id).length - rankedCategories.length})
      ranked cities     : ${rankedCities.length}       (popularity=0 skipped)
      states            : ${uniqueStates.length}
      total params      : ${params.length}
    `);

    return params;
  } catch (e) {
    console.error("generateStaticParams failed:", e);
    return [];
  }
}