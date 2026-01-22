import axios from "axios";
import { NextResponse } from "next/server";

const parseAddress = (components: any[]) => {
  const get = (type: string) =>
    components.find((c) => c.types.includes(type))?.long_name || "";

  return {
    city: get("locality") || get("postal_town") || "",
    suburb: get("sublocality") || "",
    state: get("administrative_area_level_1") || "",
    postcode: get("postal_code") || "",
    country: get("country") || "",
  };
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const placeId = searchParams.get("place_id");
    const session = searchParams.get("session");

    if (!placeId) {
      return NextResponse.json({ error: "place_id required" }, { status: 400 });
    }

    const url =
      `https://maps.googleapis.com/maps/api/place/details/json` +
      `?place_id=${placeId}` +
      `&fields=name,geometry,address_component,place_id` +
      `&sessiontoken=${session}` +
      `&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;

    const res = await axios.get(url);
    const data = res.data;



    if (!data.result) {
      return NextResponse.json({ error: "No place found" }, { status: 404 });
    }

    const address = parseAddress(data.result.address_components);

    const result = {
      place_id: data.result.place_id,
      display_name: data.result.name,
      lat: data.result.geometry.location.lat,
      lng: data.result.geometry.location.lng,
      ...address,
    };

    // console.log("Formatted result:", result);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Place details API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch place details" },
      { status: 500 }
    );
  }
}