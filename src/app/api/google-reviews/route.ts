// import { NextResponse } from "next/server";

// export async function GET(){
//     const PLACE_ID = process.env.GOOGLE_PLACE_ID;
//     const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

//     const res = await fetch(
//          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews,rating,user_ratings_total&key=${API_KEY}`
//     )
//     const data = await res.json();

//     if (!data.result){
//         return NextResponse.json({reviewa:[]})
//     }
//     return NextResponse.json({
//         reviews: data.result.reviews || [],
//         ratings: data.result.rating,
//         totalRatings: data.result.user_ratings_total,
//     })
// }
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const PLACE_ID = process.env.GOOGLE_PLACE_ID;
    const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews,rating,user_ratings_total&key=${API_KEY}`
    );

    const data = await res.json();
    if (!data.result) {
      return NextResponse.json({ reviews: [] });
    }
console.log("PLACE_ID:", process.env.GOOGLE_PLACE_ID);
    return NextResponse.json({
      reviews: data.result.reviews || [],
      ratings: data.result.rating,
      totalRatings: data.result.user_ratings_total,
    });

  } catch (error) {
    console.error("ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}