import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import pool from "@/lib/dbConnect";

const DEFAULT_LIMIT = 25;
const MAX_LIMIT = 100;

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.adminrole === "admin" ? session : null;
}

function parsePositiveInteger(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export async function GET(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const page = parsePositiveInteger(searchParams.get("page"), 1);
  const limit = Math.min(
    parsePositiveInteger(searchParams.get("limit"), DEFAULT_LIMIT),
    MAX_LIMIT,
  );
  const search = searchParams.get("search")?.trim() ?? "";
  const enriched = searchParams.get("enriched") ?? "all";

  if (!["all", "yes", "no"].includes(enriched)) {
    return NextResponse.json(
      { message: "Invalid enriched filter" },
      { status: 400 },
    );
  }

  const conditions = ["is_active = true"];
  const values: unknown[] = [];

  if (search) {
    values.push(`%${search}%`);
    const index = values.length;
    conditions.push(`(
      place_name ILIKE $${index}
      OR COALESCE(display_name, '') ILIKE $${index}
      OR COALESCE(postal_code, '') ILIKE $${index}
      OR COALESCE(state_name, '') ILIKE $${index}
      OR COALESCE(state_code, '') ILIKE $${index}
    )`);
  }

  if (enriched === "yes") {
    conditions.push(
      "(popularity IS NOT NULL OR image_url IS NOT NULL OR description IS NOT NULL)",
    );
  } else if (enriched === "no") {
    conditions.push(
      "(popularity IS NULL AND image_url IS NULL AND description IS NULL)",
    );
  }

  const where = `WHERE ${conditions.join(" AND ")}`;
  const offset = (page - 1) * limit;

  try {
    const countResult = await pool.query<{ count: string }>(
      `SELECT COUNT(*) AS count FROM australia_locations ${where}`,
      values,
    );

    const dataValues = [...values, limit, offset];
    const limitIndex = values.length + 1;
    const offsetIndex = values.length + 2;
    const dataResult = await pool.query(
      `SELECT
        id,
        place_name,
        display_name,
        postal_code,
        state_name,
        state_code,
        state_slug,
        place_slug,
        popularity,
        image_url,
        description,
        updated_at
      FROM australia_locations
      ${where}
      ORDER BY popularity DESC NULLS LAST, place_name ASC, postal_code ASC
      LIMIT $${limitIndex} OFFSET $${offsetIndex}`,
      dataValues,
    );

    const total = Number(countResult.rows[0]?.count ?? 0);
    return NextResponse.json({
      locations: dataResult.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (error) {
    console.error("[GET /api/admin/australia-locations]", error);
    return NextResponse.json(
      { message: "Unable to load Australian locations" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const id = typeof body.id === "string" ? body.id : String(body.id ?? "");
  if (!/^[1-9]\d*$/.test(id)) {
    return NextResponse.json({ message: "Invalid location id" }, { status: 400 });
  }

  const popularity =
    body.popularity === null || body.popularity === ""
      ? null
      : Number(body.popularity);
  if (
    popularity !== null &&
    (!Number.isSafeInteger(popularity) || popularity < 0 || popularity > 2_147_483_647)
  ) {
    return NextResponse.json(
      { message: "Popularity must be a non-negative whole number or empty" },
      { status: 400 },
    );
  }

  if (typeof body.image_url !== "string" || typeof body.description !== "string") {
    return NextResponse.json(
      { message: "Image URL and description must be text" },
      { status: 400 },
    );
  }

  const imageUrl = body.image_url.trim() || null;
  const description = body.description.trim() || null;

  if (imageUrl) {
    try {
      const url = new URL(imageUrl);
      if (!["http:", "https:"].includes(url.protocol)) throw new Error();
    } catch {
      return NextResponse.json(
        { message: "Image URL must be a valid HTTP or HTTPS URL" },
        { status: 400 },
      );
    }
  }

  try {
    const result = await pool.query(
      `UPDATE australia_locations
       SET popularity = $1,
           image_url = $2,
           description = $3,
           updated_at = NOW()
       WHERE id = $4 AND is_active = true
       RETURNING id, popularity, image_url, description, updated_at`,
      [popularity, imageUrl, description, id],
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { message: "Active location not found" },
        { status: 404 },
      );
    }

    revalidatePath("/", "layout");
    return NextResponse.json({ location: result.rows[0] });
  } catch (error) {
    console.error("[PATCH /api/admin/australia-locations]", error);
    return NextResponse.json(
      { message: "Unable to update Australian location" },
      { status: 500 },
    );
  }
}
