import ServicePageWrapper from "@/components/servicePage/ServicePageWrapper";
import ServiceStatePageClient from "@/components/servicePage/Servicestatepageclient";
import StructuredData from "@/components/servicePage/StructureData";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import {
  filterSeoLocations,
  findSeoRedirectLocation,
} from "@/lib/seo-locations";
import { getAllCities as getAllCitiesFromDB } from "@/lib/cache";

// export const dynamic = "force-static";
// export const revalidate = 604800;

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
  city_description: string;
  postcode?: string | null;
  source?: string | null;
  updated_at?: string;
  subcities: {
    city_id: number;
    name: string;
    slug: string;
    display_name?: string | null;
    popularity?: number;
    image_url?: string | null;
    state_slug?: string | null;
  }[];
  providers?: any[];
}

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL!;

function toTitleCase(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

function getLocationLabel(location?: { name?: string; slug?: string } | null) {
  if (location?.name) return location.name;
  if (location?.slug) return toTitleCase(location.slug);
  return null;
}

function trimDescription(description: string, maxLength = 155) {
  if (description.length <= maxLength) return description;
  const trimmed = description.slice(0, maxLength - 1).trimEnd();
  return `${trimmed.replace(/[,.!?;:]$/, "")}.`;
}

function buildCanonical(
  serviceSlug: string,
  stateSlug: string | null,
  citySlug: string | null,
  subCitySlug: string | null
) {
  const base = `https://www.taskoria.com/services/${serviceSlug}`;
  if (stateSlug && citySlug && subCitySlug)
    return `${base}/${stateSlug}/${citySlug}/${subCitySlug}`;
  if (stateSlug && citySlug) return `${base}/${stateSlug}/${citySlug}`;
  if (stateSlug) return `${base}/${stateSlug}`;
  return base;
}

function buildServicePath(
  serviceSlug: string,
  stateSlug?: string | null,
  citySlug?: string | null,
  subCitySlug?: string | null
) {
  const segments = ["/services", serviceSlug, stateSlug, citySlug, subCitySlug]
    .filter(Boolean)
    .map(String);

  return segments.join("/");
}

async function getService(serviceSlug: string): Promise<ServiceData | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/categories/${serviceSlug}`);
    return res.ok ? res.json() : null;
  } catch {
    return null;
  }
}

async function getAllCities(): Promise<City[]> {
  try {
    return (await getAllCitiesFromDB()) as unknown as City[];
  } catch {
    return [];
  }
}

async function getAllCategories(): Promise<
  {
    slug: string | null;
    name: string | null;
    rank: number | null;
    image_url?: string | null;
  }[]
> {
  try {
    const res = await fetch(`${BASE_URL}/api/signup/category-selection`);
    return res.ok ? res.json() : [];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug = [] } = await params;
  const [serviceSlug, stateSlug = null, citySlug = null, subCitySlug = null] =
    slug;

  if (!serviceSlug) {
    return {
      title: { absolute: "Professional Services Near You | Taskoria" },
      description:
        "Find and book trusted local professionals with Taskoria. Get free quotes, compare prices, and read verified reviews.",
    };
  }

  const service = await getService(serviceSlug);
  if (!service) {
    return {
      title: { absolute: "Service Not Found | Taskoria" },
      robots: { index: false, follow: false },
    };
  }

  const rawCities =
    stateSlug || citySlug || subCitySlug ? await getAllCities() : [];
  const cities = filterSeoLocations(rawCities);
  const selectedCity = citySlug
    ? (cities.find(
        (city) =>
          city.slug === citySlug &&
          (!stateSlug || city.state_slug === stateSlug)
      ) ?? null)
    : null;
  const selectedSubCity =
    subCitySlug && selectedCity
      ? (selectedCity.subcities?.find(
          (subcity) => subcity.slug === subCitySlug
        ) ?? null)
      : null;
  const hasSelectedState = stateSlug
    ? cities.some((city) => city.state_slug === stateSlug)
    : true;

  if (
    (stateSlug && !hasSelectedState) ||
    (citySlug && !selectedCity) ||
    (subCitySlug && !selectedSubCity)
  ) {
    const redirectCity =
      stateSlug && citySlug
        ? findSeoRedirectLocation(rawCities, stateSlug, citySlug)
        : null;
    const redirectUrl = redirectCity?.slug
      ? buildCanonical(serviceSlug, stateSlug, redirectCity.slug, null)
      : serviceSlug && stateSlug && hasSelectedState
        ? buildCanonical(serviceSlug, stateSlug, null, null)
        : `https://www.taskoria.com/services/${serviceSlug}`;

    return {
      title: { absolute: `${service.name} | Taskoria` },
      robots: { index: false, follow: true },
      alternates: { canonical: redirectUrl },
    };
  }
  const cityName =
    getLocationLabel(selectedCity) ?? (citySlug ? toTitleCase(citySlug) : null);
  const subCityName =
    getLocationLabel(selectedSubCity) ??
    (subCitySlug ? toTitleCase(subCitySlug) : null);
  const stateName =
    selectedCity?.state_name ?? (stateSlug ? toTitleCase(stateSlug) : null);
  const isStatePage = stateSlug && !citySlug;
  const serviceName = service.name.trim();
  const serviceNameLower = serviceName.toLowerCase();
  const canonicalUrl = buildCanonical(
    serviceSlug,
    stateSlug,
    citySlug,
    subCitySlug
  );
  const imageUrl =
    service.hero_image ??
    `https://www.taskoria.com/og-images/${serviceSlug}.jpg`;

  const title =
    subCityName && cityName && stateName
      ? `${serviceName} in ${subCityName}, ${cityName} ${stateName} | Taskoria`
      : cityName && stateName
        ? `${serviceName} in ${cityName}, ${stateName} | Free Quotes | Taskoria`
        : cityName
          ? `${serviceName} in ${cityName} | Free Quotes | Taskoria`
          : isStatePage && stateName
            ? `${serviceName} in ${stateName} | Trusted Local Pros | Taskoria`
            : `${serviceName} Services in Australia | Free Quotes | Taskoria`;

  const description = trimDescription(
    subCityName && cityName && stateName
      ? `Find trusted ${serviceNameLower} professionals in ${subCityName}, ${cityName}, ${stateName}. Compare verified providers, read reviews and request free quotes on Taskoria.`
      : cityName && stateName
        ? `Find trusted ${serviceNameLower} professionals in ${cityName}, ${stateName}. Compare local providers, read verified reviews and request free quotes on Taskoria.`
        : cityName
          ? `Find trusted ${serviceNameLower} professionals in ${cityName}. Compare local providers, read verified reviews and request free quotes on Taskoria.`
          : isStatePage && stateName
            ? `Find trusted ${serviceNameLower} professionals across ${stateName}. Compare verified providers by city, read reviews and request free quotes on Taskoria.`
            : service.description
              ? `${service.description.trim()} Get free quotes from verified ${serviceNameLower} professionals across Australia on Taskoria.`
              : `Hire trusted ${serviceNameLower} professionals across Australia. Compare verified providers, read reviews and request free quotes on Taskoria.`
  );

  const keywords = cityName
    ? [
        `${serviceNameLower} ${cityName}`,
        `${serviceNameLower} in ${cityName}`,
        `${cityName} ${serviceNameLower} services`,
        `hire ${serviceNameLower} ${cityName}`,
        `best ${serviceNameLower} ${cityName}`,
        `${serviceNameLower} near me`,
        `${serviceNameLower} quotes ${cityName}`,
        ...(stateName ? [`${serviceNameLower} ${stateName}`] : []),
        ...(subCityName ? [`${serviceNameLower} ${subCityName}`] : []),
      ].join(", ")
    : isStatePage
      ? [
          `${serviceNameLower} ${stateName}`,
          `${serviceNameLower} in ${stateName}`,
          `${stateName} ${serviceNameLower} services`,
          `hire ${serviceNameLower} ${stateName}`,
          `best ${serviceNameLower} ${stateName}`,
          `${serviceNameLower} near me`,
        ].join(", ")
      : [
          `${serviceNameLower} australia`,
          `${serviceNameLower} services australia`,
          `hire ${serviceNameLower} australia`,
          `${serviceNameLower} near me`,
          `${serviceNameLower} quotes`,
          `professional ${serviceNameLower}`,
        ].join(", ");

  return {
    title: { absolute: title },
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

  const [service, rawCities, categories] = await Promise.all([
    getService(serviceSlug),
    getAllCities(),
    getAllCategories(),
  ]);
  const cities = filterSeoLocations(rawCities);

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
    const stateCitiesRaw = cities
      .filter((c) => c.state_slug === stateSlug)
      .sort((a, b) => b.popularity - a.popularity);
    const stateCities = Array.from(
      new Map(stateCitiesRaw.map((c) => [c.name.toLowerCase(), c])).values()
    );
    if (!stateCities.length) notFound();
    const stateName = stateCities[0]?.state_name ?? toTitleCase(stateSlug);

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
        <StructuredData
          service={service}
          city={null}
          citySlug={null}
          stateSlug={stateSlug}
          subCitySlug={null}
          showFaqPage={Boolean(service.faqs?.length)}
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
    ? (cities.find(
        (city) =>
          city.slug === citySlug &&
          (!stateSlug || city.state_slug === stateSlug)
      ) ?? null)
    : null;

  const selectedSubCity = subCitySlug
    ? (selectedLocation?.subcities?.find((s) => s.slug === subCitySlug) ?? null)
    : null;

  const activeLocation = selectedSubCity ?? selectedLocation;

  if (citySlug && !selectedLocation) {
    if (stateSlug) {
      const redirectCity = findSeoRedirectLocation(
        rawCities,
        stateSlug,
        citySlug
      );

      if (redirectCity?.slug) {
        redirect(buildServicePath(serviceSlug, stateSlug, redirectCity.slug));
      }
    }

    if (stateSlug && cities.some((city) => city.state_slug === stateSlug)) {
      redirect(`/services/${serviceSlug}/${stateSlug}`);
    }

    redirect(`/services/${serviceSlug}`);
  }

  if (subCitySlug && !selectedSubCity) {
    redirect(`/services/${serviceSlug}/${stateSlug}/${citySlug}`);
  }

  return (
    <>
      <StructuredData
        service={service}
        city={selectedLocation}
        citySlug={citySlug}
        stateSlug={stateSlug}
        subCitySlug={subCitySlug}
        showFaqPage={Boolean(service.faqs?.length)}
        providers={selectedLocation?.providers || []}
      />
      <ServicePageWrapper
        service={service}
        cities={citySlug ? [] : cities.slice(0, 40)}
        rankedCategories={categories}
        initialLocation={activeLocation}
        citySlug={citySlug}
        stateSlug={stateSlug}
        subCitySlug={subCitySlug}
      />
    </>
  );
}

// export async function generateStaticParams() {
//   try {
//     const [cities, categoriesRaw] = await Promise.all([
//       getAllCities(),
//       getAllCategories(), // now goes through /api/categories with cache headers
//     ]);

//     const params: { slug: string[] }[] = [];

//     const rankedCategories = categoriesRaw
//       .filter((c) => c.slug && c.rank != null)
//       .sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999));

//     const rankedCities = [...cities]
//       .filter((c) => c.popularity > 0 && c.slug && c.state_slug)
//       .sort((a, b) => b.popularity - a.popularity)
//       .filter((c, i, arr) => arr.findIndex((x) => x.slug === c.slug) === i);

//     const uniqueStates = [
//       ...new Map(
//         rankedCities.map((c) => [c.state_slug, c.state_slug])
//       ).values(),
//     ];

//     // /services/[service]
//     for (const cat of rankedCategories) {
//       params.push({ slug: [cat.slug!] });
//     }

//     // /services/[service]/[state]
//     for (const cat of rankedCategories) {
//       for (const stateSlug of uniqueStates) {
//         params.push({ slug: [cat.slug!, stateSlug] });
//       }
//     }

//     // /services/[service]/[state]/[city]
//     for (const cat of rankedCategories) {
//       for (const city of rankedCities) {
//         params.push({ slug: [cat.slug!, city.state_slug, city.slug] });
//       }
//     }

//     return params;
//   } catch (e) {
//     console.error("generateStaticParams failed:", e);
//     return [];
//   }
// }
