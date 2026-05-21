import { getAllCities, getCityBySlug, getSubcities } from "@/lib/cache";
import { NextResponse } from "next/server";


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const stateSlug = searchParams.get("state");
  const citySlug = searchParams.get("city");

  try {
    if (citySlug) {
      const city = await getCityBySlug(citySlug);

      if (!city) return NextResponse.json(null);

      const subcities = await getSubcities(city.city_id);

      return NextResponse.json(
        {
          ...city,
          latitude: city.latitude ? parseFloat(city.latitude) : null,
          longitude: city.longitude ? parseFloat(city.longitude) : null,
          subcities,
        },
        {
          headers: {
            "Cache-Control":
              "public, s-maxage=86400, stale-while-revalidate=604800",
          },
        }
      );
    }

    const rows = await getAllCities();

    const filtered = stateSlug
      ? rows.filter((r) => r.state_slug === stateSlug)
      : rows;

    const map = new Map<number, any>();
    const cities: any[] = [];

    for (const row of filtered) {
      if (!row.parent_city_id) {
        const city = {
          ...row,
          subcities: [],
        };
        map.set(row.city_id, city);
        cities.push(city);
      }
    }

    for (const row of filtered) {
      if (row.parent_city_id && map.has(row.parent_city_id)) {
        map.get(row.parent_city_id).subcities.push(row);
      }
    }

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