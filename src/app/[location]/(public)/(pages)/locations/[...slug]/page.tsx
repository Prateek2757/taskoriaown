import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Script from "next/script";
import StatePageClient from "../components/state-page/state-page";
import CityPageClient from "../components/City-page/citypageclient";
import {
  getAllCities,
  getCategoriesFromDB,
  getNearbySeoCitiesFromDB,
  getPopularSeoCitiesByStateFromDB,
  getSeoCitiesByStateFromDB,
  getSeoCityBySlugFromDB,
  getSeoStateSummaryFromDB,
  getSeoStatesFromDB,
} from "@/lib/cache";
import { getCityDedupKey, getCityLabel } from "@/lib/location-labels";
import {
  filterSeoLocations,
  findSeoRedirectLocation,
} from "@/lib/seo-locations";
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
  postcode?: string | null;
  source?: string | null;
  updated_at?: string;
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
  rank?: number | null;
  subcategories: {
    category_id: number;
    name: string;
    slug: string;
    description?: string;
    image_url?: string;
    rank?: number | null;
  }[];
}

type StateSummary = {
  state_slug: string;
  state_name: string;
};

type StateInfo = StateSummary & {
  country_name: string;
  city_count: number;
};

type CategoryRow = {
  category_id: number;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  rank?: number | null;
  parent_category_id?: number | null;
};

function toClientCity(city: City): City {
  return {
    city_id: city.city_id,
    name: city.name,
    slug: city.slug,
    display_name: city.display_name,
    popularity: city.popularity,
    latitude: city.latitude ?? null,
    longitude: city.longitude ?? null,
    image_url: city.image_url,
    state_slug: city.state_slug,
    state_name: city.state_name,
    country_name: city.country_name,
    postcode: city.postcode,
    source: city.source,
    updated_at: city.updated_at,
    subcities: (city.subcities ?? []).map((subcity) => ({
      city_id: subcity.city_id,
      name: subcity.name,
      slug: subcity.slug,
      display_name: subcity.display_name,
      popularity: subcity.popularity,
      image_url: subcity.image_url,
    })),
  };
}

function toCategory(category: CategoryRow): Omit<CategoryWithSubs, "subcategories"> {
  return {
    category_id: category.category_id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    image_url: category.image_url,
    rank: category.rank,
  };
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
    const raw = (await getCategoriesFromDB()) as CategoryRow[];

    const parents = raw
      .filter((c) => !c.parent_category_id && c.slug && c.name)
      .sort((a, b) => {
        const rankDiff =
          (a.rank ?? Number.MAX_SAFE_INTEGER) -
          (b.rank ?? Number.MAX_SAFE_INTEGER);
        if (rankDiff !== 0) return rankDiff;
        return a.name.localeCompare(b.name);
      });

    return parents.map((p) => ({
      ...toCategory(p),
      subcategories: raw
        .filter((c) => c.parent_category_id === p.category_id && c.slug && c.name)
        .sort((a, b) => {
          const rankDiff =
            (a.rank ?? Number.MAX_SAFE_INTEGER) -
            (b.rank ?? Number.MAX_SAFE_INTEGER);
          if (rankDiff !== 0) return rankDiff;
          return a.name.localeCompare(b.name);
        })
        .map(toCategory),
    }));
  } catch {
    return [];
  }
}

async function getStateCities(stateSlug: string): Promise<City[]> {
  try {
    return filterSeoLocations(
      (await getSeoCitiesByStateFromDB(stateSlug)) as unknown as City[]
    ).map(toClientCity);
  } catch {
    return [];
  }
}

async function getSelectedCity(
  stateSlug: string,
  citySlug: string
): Promise<City | null> {
  try {
    const city = (await getSeoCityBySlugFromDB(
      stateSlug,
      citySlug
    )) as unknown as City | null;
    const seoCity = city ? filterSeoLocations([city])[0] : null;
    return seoCity ? toClientCity(seoCity) : null;
  } catch {
    return null;
  }
}

async function getStates(): Promise<StateSummary[]> {
  try {
    return (await getSeoStatesFromDB()) as StateSummary[];
  } catch {
    return [];
  }
}

async function getStateInfo(stateSlug: string): Promise<StateInfo | null> {
  try {
    return (await getSeoStateSummaryFromDB(stateSlug)) as StateInfo | null;
  } catch {
    return null;
  }
}

async function getNearbyCities(city: City, limit = 10): Promise<City[]> {
  try {
    return filterSeoLocations(
      (await getNearbySeoCitiesFromDB(
        city.state_slug,
        city.slug,
        city.latitude,
        city.longitude,
        limit * 2
      )) as unknown as City[]
    )
      .map(toClientCity)
      .slice(0, limit);
  } catch {
    return [];
  }
}

async function getPopularStateCities(
  stateSlug: string,
  limit = 12
): Promise<City[]> {
  try {
    return filterSeoLocations(
      (await getPopularSeoCitiesByStateFromDB(
        stateSlug,
        limit * 2
      )) as unknown as City[]
    )
      .map(toClientCity)
      .slice(0, limit);
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [stateSlug, citySlug] = slug;
  const isStatePage = !citySlug;

  if (isStatePage) {
    const stateInfo = await getStateInfo(stateSlug);
    if (!stateInfo)
      return {
        title: { absolute: "State Not Found | Taskoria" },
        robots: { index: false, follow: false },
      };

    const stateName = stateInfo.state_name;
    const title = `Services in ${stateName} | Find Local Professionals`;
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

  const city = await getSelectedCity(stateSlug, citySlug);
  if (!city)
    return {
      title: { absolute: "City Not Found | Taskoria" },
      robots: { index: false, follow: false },
    };

  const cityName = getCityLabel(city);
  const title = `Services in ${cityName} | Find Local Professionals | Taskoria`;
  const description = `Discover trusted local service providers in ${cityName}, ${city.state_name}. From cleaning to removals, find and compare professionals for any task — get free quotes on Taskoria.`;
  const canonicalUrl = `https://www.taskoria.com/locations/${stateSlug}/${citySlug}`;
  const imageUrl = city.image_url ?? `https://www.taskoria.com/${citySlug}.jpg`;

  return {
    title: { absolute: title },
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

  if (isStatePage) {
    const [stateInfo, categoryTree, states] = await Promise.all([
      getStateInfo(stateSlug),
      getCategories(),
      getStates(),
    ]);

    if (!stateInfo) notFound();

    const stateName = stateInfo.state_name;
    const countryName = stateInfo.country_name;

    const otherStates = states
      .filter((state) => state.state_slug !== stateSlug)
      .sort((a, b) => a.state_name.localeCompare(b.state_name));

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
          cities={[]}
          cityCount={stateInfo.city_count}
          categoryTree={categoryTree}
          otherStates={otherStates}
        />
      </>
    );
  }

  const [city, categoryTree] = await Promise.all([
    getSelectedCity(stateSlug, citySlug),
    getCategories(),
  ]);

  if (!city) {
    const rawCities = (await getAllCities()) as unknown as City[];
    const allCities = filterSeoLocations(rawCities);
    const redirectCity = findSeoRedirectLocation(rawCities, stateSlug, citySlug);

    if (redirectCity?.slug) {
      redirect(`/locations/${stateSlug}/${redirectCity.slug}`);
    }

    const hasStatePage = allCities.some((c) => c.state_slug === stateSlug);
    if (hasStatePage) redirect(`/locations/${stateSlug}`);

    redirect("/locations");
  }

  const [nearbyCitiesRaw, sameStateRaw] = await Promise.all([
    getNearbyCities(city, 10),
    getPopularStateCities(stateSlug, 12),
  ]);

  const seenNearby = new Set<string>();
  const nearbyCities: City[] = nearbyCitiesRaw
    .filter((c) => c.city_id !== city.city_id)
    .filter((c) => {
      const key = getCityDedupKey(c);
      if (seenNearby.has(key)) return false;
      seenNearby.add(key);
      return true;
    })
    .slice(0, 10);

  const sameStateCities: City[] = Array.from(
    new Map(
      sameStateRaw
        .filter((c) => c.city_id !== city.city_id)
        .map((c) => [getCityDedupKey(c), c])
    ).values()
  ).slice(0, 12);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Services in ${getCityLabel(city)}`,
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

// export async function generateStaticParams() {
//   try {
//     const cities = await getAllCities();

//     const params: { slug: string[] }[] = [];

//     const statesSeen = new Set<string>();

//     // State pages
//     for (const c of cities) {
//       if (c.state_slug && !statesSeen.has(c.state_slug)) {
//         statesSeen.add(c.state_slug);

//         params.push({
//           slug: [c.state_slug],
//         });
//       }
//     }

//     for (const c of cities) {
//       if (c.state_slug && c.slug) {
//         params.push({
//           slug: [c.state_slug, c.slug],
//         });
//       }
//     }

//     return params;
//   } catch (error) {
//     console.error("generateStaticParams error:", error);

   
//     return [
//       {
//         slug: ["fallback"],
//       },
//     ];
//   }
// }
