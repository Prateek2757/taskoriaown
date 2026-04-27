import CityPageClient from "@/components/City-page/citypageclient";
import { Metadata } from "next";
import { notFound } from "next/navigation";

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
  subcategories: { category_id: number; name: string; slug: string }[];
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

/** Haversine distance in km. */
function distanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const toRad = (v: number) => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── DATA FETCHERS ────────────────────────────────────────────────────────────

async function getAllCities(): Promise<City[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/service-location`,
      { next: { revalidate: 3600 } }
    );
    return res.ok ? await res.json() : [];
  } catch {
    return [];
  }
}

async function getCategories(): Promise<CategoryWithSubs[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/signup/category-selection`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const raw: Array<{
      category_id: number;
      name: string;
      slug: string;
      description?: string;
      image_url?: string;
      parent_category_id?: number | null;
    }> = await res.json();

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
  const { stateSlug, citySlug } = await params;
  const cities = await getAllCities();
  const city = cities.find(
    (c) => c.slug === citySlug && c.state_slug === stateSlug
  );

  if (!city) {
    return {
      title: "City Not Found | Taskoria",
      robots: { index: false, follow: false },
    };
  }

  const cityName = city.display_name ?? city.name;
  const title = `Services in ${cityName} | Find Local Professionals | Taskoria`;
  const description = `Discover trusted local service providers in ${cityName}, ${city.state_name}. From cleaning to removals, find and compare professionals for any task — get free quotes on Taskoria.`;
  const canonicalUrl = `https://www.taskoria.com/cities/${stateSlug}/${citySlug}`;
  const imageUrl =
    city.image_url ??
    `https://www.taskoria.com/og-images/cities/${citySlug}.jpg`;

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
      `tasks ${cityName}`,
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


export default async function CityPage({ params }: Props) {
  const { slug } = await params;
  const [stateSlug, citySlug] = slug;

  const [allCities, categoryTree] = await Promise.all([
    getAllCities(),
    getCategories(),
  ]);

  // console.log(allCities);
  

  const city = allCities.find((c) => c.slug === citySlug || c.state_slug === stateSlug);

  if (!city) notFound();

  type CityWithDist = City & { _dist: number };
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
    .slice(0, 10)
    .map(({ _dist: _, ...rest }) => rest as City);

  const sameStateCities: City[] = allCities
    .filter((c) => c.state_slug === stateSlug && c.city_id !== city.city_id)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 12);

  return (
    <>
      <h1 className="sr-only">
        Services in {city.display_name ?? city.name}, {city.state_name}
      </h1>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: `Services in ${city.display_name ?? city.name}`,
            description: `Find local service professionals in ${city.name}, ${city.state_name}`,
            url: `https://www.taskoria.com/cities/${stateSlug}/${citySlug}`,
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
          }),
        }}
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
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/service-location`
    );
    const cities: City[] = res.ok ? await res.json() : [];
    return cities.map((c) => ({
      stateSlug: c.state_slug,
      citySlug: c.slug,
    }));
  } catch {
    return [];
  }
}
