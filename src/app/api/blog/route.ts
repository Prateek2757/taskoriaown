import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getAllBlogPosts } from "@/lib/cache";
import { revalidateTag } from "next/cache";

export async function GET(req: Request) {
 
  try {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT
              post_id, slug, title, excerpt, author_name, author_role,
              author_image, image_url, category, tags, is_featured, is_published,
              views, likes, read_time, published_at, created_at,updated_at
             FROM blog_posts
             ORDER BY created_at DESC`
      );
      return NextResponse.json(
        { posts: result.rows, total: result.rows.length },
        {
          headers: {
            "Cache-Control":
              "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
        }
      );
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to fetch posts" },
      { status: 500 }
    );
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
      slug,
      title,
      excerpt,
      content,
      author_name,
      author_role,
      author_image,
      image_url,
      category,
      tags = [],
      is_featured = false,
      is_published = false,
      read_time,
    } = body;

    if (!slug || !title || !content || !category) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }
    const publishedAt = is_published ? new Date() : null;

    const { rows } = await client.query(
      `INSERT INTO blog_posts
        (slug, title, excerpt, content, author_name, author_role,
         author_image, image_url, category, tags, is_featured,
         is_published, read_time, published_at, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
       RETURNING *`,
      [
        slug,
        title,
        excerpt,
        content,
        author_name,
        author_role,
        author_image,
        image_url,
        category,
        tags,
        is_featured,
        is_published,
        read_time,
        publishedAt,
        Number(session.user.id),
      ]
    );
    revalidateTag("blog-posts", "default");
    return NextResponse.json(rows[0], { status: 201 });
  } catch (err: unknown) {
    if ((err as { code?: string }).code === "23505") {
      return NextResponse.json(
        { message: "Slug already exists" },
        { status: 409 }
      );
    }
    console.error(err);
    return NextResponse.json(
      { message: "Failed to create post" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
