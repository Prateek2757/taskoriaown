// import { NextRequest, NextResponse } from "next/server";
// import pool from "@/lib/dbConnect";

// export async function POST(req: NextRequest) {
//   try {
//     const { user_id, location_id, is_nationwide } = await req.json();

//     if (!user_id) return NextResponse.json({ message: "Missing user_id" }, { status: 400 });

//     await pool.query(
//       `
//       UPDATE user_profiles
//       SET location_id=$1, updated_at=NOW()
//       WHERE user_id=$2
//       `,
//       [is_nationwide ? null : location_id, user_id]
//     );

//     return NextResponse.json({ message: "Location saved" });
//   } catch (err: unknown) {
//     if (err instanceof Error)
//       return NextResponse.json({ message: err.message }, { status: 500 });
//     return NextResponse.json({ message: "Unknown error" }, { status: 500 });
//   }
// }
import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT city_id, name FROM cities ORDER BY name
    `);
    return NextResponse.json(result.rows);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Unknown error" }, { status: 500 });
  }
}