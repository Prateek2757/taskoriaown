import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");
  const limit = Number(searchParams.get("limit") ?? 20);
  const offset = Number(searchParams.get("offset") ?? 0);

  const session = await getServerSession(authOptions);
  if (!session ) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const client = await pool.connect();
  try {
    const conditions = ["is_published = true"];
    const values: unknown[] = [];

    if (category) {
      values.push(category);
      conditions.push(`category = $${values.length}`);
    }
    if (featured === "true") {
      conditions.push("is_featured = true");
    }

    values.push(limit, offset);

    const { rows } = await client.query(
      `SELECT
        post_id, slug, title, excerpt, author_name, author_role,
        author_image, image_url, category, tags, is_featured,
        views, likes, read_time, published_at
       FROM blog_posts
       WHERE ${conditions.join(" AND ")}
       ORDER BY published_at DESC
       LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values
    );

    return NextResponse.json(rows, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Failed to fetch posts" }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.adminrole !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const client = await pool.connect();
  try {
    const body = await req.json();
    const {
      slug, title, excerpt, content, author_name, author_role,
      author_image, image_url, category, tags = [],
      is_featured = false, is_published = false, read_time,
    } = body;

    if (!slug || !title || !content || !category) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const { rows } = await client.query(
      `INSERT INTO blog_posts
        (slug, title, excerpt, content, author_name, author_role,
         author_image, image_url, category, tags, is_featured,
         is_published, read_time, published_at, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,
         CASE WHEN $12 THEN NOW() ELSE NULL END, $14)
       RETURNING *`,
      [
        slug, title, excerpt, content, author_name, author_role,
        author_image, image_url, category, tags, is_featured,
        is_published, read_time, Number(session.user.id),
      ]
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch (err: unknown) {
    if ((err as { code?: string }).code === "23505") {
      return NextResponse.json({ message: "Slug already exists" }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ message: "Failed to create post" }, { status: 500 });
  } finally {
    client.release();
  }
}