import {
  getCityBySlug,
  getPopularSeoCitiesFromDB,
  getSeoCitiesByStateFromDB,
  getSubcities,
} from "@/lib/cache";
import { filterSeoLocations, isSeoLocation } from "@/lib/seo-locations";
import { NextResponse } from "next/server";

const DEFAULT_CITY_LIMIT = 80;
const MAX_CITY_LIMIT = 200;

function getRequestedLimit(searchParams: URLSearchParams) {
  const requestedLimit = Number(searchParams.get("limit"));

  if (!Number.isFinite(requestedLimit)) return DEFAULT_CITY_LIMIT;

  return Math.min(Math.max(Math.trunc(requestedLimit), 1), MAX_CITY_LIMIT);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const stateSlug = searchParams.get("state");
  const citySlug = searchParams.get("city");
  const limit = getRequestedLimit(searchParams);

  try {
    if (citySlug) {
      const city = await getCityBySlug(citySlug, stateSlug);

      if (!city || !isSeoLocation(city)) return NextResponse.json(null);

      const subcities = await getSubcities(city.city_id);
      const seoSubcities = filterSeoLocations(
        subcities.map((subcity) => ({
          ...subcity,
          state_slug: subcity.state_slug ?? city.state_slug,
        }))
      );

      return NextResponse.json(
        {
          ...city,
          latitude: city.latitude ? parseFloat(city.latitude) : null,
          longitude: city.longitude ? parseFloat(city.longitude) : null,
          subcities: seoSubcities,
        },
        {
          headers: {
            "Cache-Control":
              "public, s-maxage=86400, stale-while-revalidate=604800",
          },
        }
      );
    }

    const rows = stateSlug
      ? await getSeoCitiesByStateFromDB(stateSlug)
      : await getPopularSeoCitiesFromDB(limit * 2);
    const cities = filterSeoLocations(rows).slice(0, limit);

    return NextResponse.json(cities, {
      headers: {
        "Cache-Control":
          "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
