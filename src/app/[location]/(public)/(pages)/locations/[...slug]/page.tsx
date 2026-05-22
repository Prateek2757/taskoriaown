import { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import StatePageClient from "../components/state-page/state-page";
import CityPageClient from "../components/City-page/citypageclient";
import { getAllCities, getCategoriesFromDB } from "@/lib/cache";
export const revalidate = 604800;

export const dynamic = "force-static";
type Props = {
  params: Promise<{ slug: string[] }>;
};

export interface City {
  city_id: number;
  name: string;
  slug: string;
  display_name: string | null;
  popularity: number;
  latitude: number | null;
  longitude: number | null;
  image_url: string | null;
  state_slug: string;
  state_name: string;
  country_name: string;
  subcities: SubCity[];
}

export interface SubCity {
  city_id: number;
  name: string;
  slug: string;
  display_name: string | null;
  popularity: number;
  image_url: string | null;
}

export interface CategoryWithSubs {
  category_id: number;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
}

function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const toRad = (v: number) => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// async function getAllCities(): Promise<City[]> {
//   try {
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_APP_URL}/api/service-location`,
//       { next: { revalidate: 84600 } }
//     );
//     return res.ok ? await res.json() : [];
//   } catch {
//     return [];
//   }
// }

async function getCategories(): Promise<CategoryWithSubs[]> {
  try {
    const raw = await getCategoriesFromDB();

    const parents = raw.filter((c) => !c.parent_category_id);

    return parents.map((p) => ({
      ...p,

      subcategories: raw.filter((c) => c.parent_category_id === p.category_id),
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [stateSlug, citySlug] = slug;
  const isStatePage = !citySlug;

  const cities = await getAllCities();

  if (isStatePage) {
    const stateCities = cities.filter((c) => c.state_slug === stateSlug);
    if (!stateCities.length)
      return {
        title: "State Not Found | Taskoria",
        robots: { index: false, follow: false },
      };

    const stateName = stateCities[0].state_name;
    const title = `Services in ${stateName} | Find Local Professionals | Taskoria`;
    const description = `Find trusted local service providers across ${stateName}. Browse all cities and categories — get free quotes from verified professionals on Taskoria.`;
    const canonicalUrl = `https://www.taskoria.com/locations/${stateSlug}`;

    return {
      title,
      description,
      keywords: [
        `services in ${stateName}`,
        `${stateName} professionals`,
        `local services ${stateName}`,
        `hire ${stateName}`,
        `tradespeople ${stateName}`,
      ].join(", "),
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
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
      },
      twitter: { card: "summary_large_image", title, description },
      alternates: { canonical: canonicalUrl },
    };
  }

  const city = cities.find(
    (c) => c.slug === citySlug && c.state_slug === stateSlug
  );
  if (!city)
    return {
      title: "City Not Found | Taskoria",
      robots: { index: false, follow: false },
    };

  const cityName = city.display_name ?? city.name;
  const title = `Services in ${cityName} | Find Local Professionals | Taskoria`;
  const description = `Discover trusted local service providers in ${cityName}, ${city.state_name}. From cleaning to removals, find and compare professionals for any task — get free quotes on Taskoria.`;
  const canonicalUrl = `https://www.taskoria.com/locations/${stateSlug}/${citySlug}`;
  const imageUrl = city.image_url ?? `https://www.taskoria.com/${citySlug}.jpg`;

  return {
    title,
    description,
    keywords: [
      `services in ${cityName}`,
      `${cityName} professionals`,
      `hire ${cityName}`,
      `local services ${cityName}`,
      `${cityName} ${city.state_name} services`,
      `tradespeople ${cityName}`,
    ].join(", "),
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
          alt: `Services in ${cityName}`,
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
    alternates: { canonical: canonicalUrl },
  };
}

export default async function CityOrStatePage({ params }: Props) {
  const { slug } = await params;
  const [stateSlug, citySlug] = slug;
  const isStatePage = !citySlug;

  const [allCities, categoryTree] = await Promise.all([
    getAllCities(),
    getCategories(),
  ]);
  //  const {categories,loading}= useCategories()

  if (isStatePage) {
    const stateCitiesRaw = allCities
      .filter((c) => c.state_slug === stateSlug)
      .sort((a, b) => b.popularity - a.popularity);

    const stateCities = Array.from(
      new Map(stateCitiesRaw.map((c) => [c.name.toLowerCase(), c])).values()
    );

    if (!stateCities.length) notFound();

    const stateName = stateCities[0].state_name;
    const countryName = stateCities[0].country_name;

    const otherStates = [
      ...new Map(
        allCities
          .filter((c) => c.state_slug !== stateSlug)
          .map((c) => [
            c.state_slug,
            { state_slug: c.state_slug, state_name: c.state_name },
          ])
      ).values(),
    ].sort((a, b) => a.state_name.localeCompare(b.state_name));

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: `Services in ${stateName}`,
      description: `Find local service professionals across ${stateName}, ${countryName}`,
      url: `https://www.taskoria.com/locations/${stateSlug}`,
      areaServed: {
        "@type": "State",
        name: stateName,
        containedInPlace: { "@type": "Country", name: countryName },
      },
    };

    return (
      <>
        <h1 className="sr-only">Services in {stateName}</h1>

        <Script
          id="state-jsonld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <StatePageClient
          stateSlug={stateSlug}
          stateName={stateName}
          countryName={countryName}
          cities={stateCities}
          categoryTree={categoryTree}
          otherStates={otherStates}
        />
      </>
    );
  }

  const city = allCities.find(
    (c) => c.slug === citySlug && c.state_slug === stateSlug
  );

  if (!city) notFound();

  type CityWithDist = City & { _dist: number };
  const seen = new Set<string>();

  const nearbyCities: City[] = (allCities as CityWithDist[])
    .filter((c) => c.city_id !== city.city_id)
    .map((c) => ({
      ...c,
      _dist:
        city.latitude != null &&
        city.longitude != null &&
        c.latitude != null &&
        c.longitude != null
          ? distanceKm(city.latitude, city.longitude, c.latitude, c.longitude)
          : Infinity,
    }))
    .sort((a, b) =>
      a._dist !== b._dist ? a._dist - b._dist : b.popularity - a.popularity
    )
    .filter((c) => {
      const key = c.name.trim().toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 10)
    .map(({ _dist: _, ...rest }) => rest as City);

  const sameStateRaw = allCities
    .filter((c) => c.state_slug === stateSlug && c.city_id !== city.city_id)
    .sort((a, b) => b.popularity - a.popularity);

  const sameStateCities: City[] = Array.from(
    new Map(sameStateRaw.map((c) => [c.name.toLowerCase(), c])).values()
  ).slice(0, 12);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Services in ${city.display_name ?? city.name}`,
    description: `Find local service professionals in ${city.name}, ${city.state_name}`,
    url: `https://www.taskoria.com/locations/${stateSlug}/${citySlug}`,
    ...(city.latitude && city.longitude
      ? {
          spatialCoverage: {
            "@type": "Place",
            name: city.name,
            geo: {
              "@type": "GeoCoordinates",
              latitude: city.latitude,
              longitude: city.longitude,
            },
          },
        }
      : {}),
  };

  return (
    <>
      <h1 className="sr-only">
        Services in {city.display_name ?? city.name}, {city.state_name}
      </h1>

      <Script
        id="city-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <CityPageClient
        city={city}
        categoryTree={categoryTree}
        nearbyCities={nearbyCities}
        sameStateCities={sameStateCities}
        stateSlug={stateSlug}
      />
    </>
  );
}

export async function generateStaticParams() {
  try {
    const cities = await getAllCities();

    const params: { slug: string[] }[] = [];

    const statesSeen = new Set<string>();

    // State pages
    for (const c of cities) {
      if (c.state_slug && !statesSeen.has(c.state_slug)) {
        statesSeen.add(c.state_slug);

        params.push({
          slug: [c.state_slug],
        });
      }
    }

    for (const c of cities) {
      if (c.state_slug && c.slug) {
        params.push({
          slug: [c.state_slug, c.slug],
        });
      }
    }

    return params;
  } catch (error) {
    console.error("generateStaticParams error:", error);

   
    return [
      {
        slug: ["fallback"],
      },
    ];
  }
}
