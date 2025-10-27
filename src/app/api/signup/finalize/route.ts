// import { NextRequest, NextResponse } from "next/server";
// import pool from "@/lib/dbConnect";

// export async function POST(req: NextRequest) {
//   const client = await pool.connect();
//   try {
//     const {
//       user_id,
//       category_id,
//       city_id,
//       is_nationwide,
//       name,
//       email,
//       phone,
//     } = await req.json();

//     if (!user_id || !category_id || !name || !email) {
//       return NextResponse.json(
//         { message: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     await client.query("BEGIN");

//     // Link user to chosen category
//     await client.query(
//       `INSERT INTO user_categories (user_id, category_id)
//        VALUES ($1, $2)
//        ON CONFLICT DO NOTHING`,
//       [user_id, category_id]
//     );

//     // Update or insert profile
//     await client.query(
//       `
//       INSERT INTO user_profiles (user_id, display_name, location_id, is_provider)
//       VALUES ($1, $2, $3, TRUE)
//       ON CONFLICT (user_id)
//       DO UPDATE SET
//         display_name = EXCLUDED.display_name,
//         location_id = EXCLUDED.location_id,
//         is_provider = TRUE,
//         updated_at = NOW()
//       `,
//       [user_id, name, is_nationwide ? null : city_id]
//     );

//     // Update user record
//     const result = await client.query(
//       `
//       UPDATE users
//       SET email = $1,
//           phone = $2,
//           is_deleted = FALSE,
//           updated_at = NOW()
//       WHERE user_id = $3
//       RETURNING user_id, email
//       `,
//       [email, phone || null, user_id]
//     );

//     await client.query("COMMIT");

//     return NextResponse.json({
//       message: "Onboarding completed successfully",
//       user: result.rows[0],
//     });
//   } catch (err: unknown) {
//     await client.query("ROLLBACK");
//     if (err instanceof Error)
//       return NextResponse.json({ message: err.message }, { status: 500 });
//     return NextResponse.json({ message: "Unknown error" }, { status: 500 });
//   } finally {
//     client.release();
//   }
// }