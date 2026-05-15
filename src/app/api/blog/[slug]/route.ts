import { NextResponse } from "next/server";
import { getBlogPostBySlug } from "@/lib/cache";
import pool from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { revalidateTag } from "next/cache";

export async function GET(
  _req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const slug = (await context.params).slug;

    if (!slug) {
      return NextResponse.json({ message: "Missing slug" }, { status: 400 });
    }

    const row = await getBlogPostBySlug(slug);

    if (!row) {
      return NextResponse.json(null, { status: 404 });
    }

    pool.query(
      `UPDATE blog_posts SET views = views + 1 WHERE slug = $1`,
      [slug]
    );

    return NextResponse.json(row, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Unknown error" }, { status: 500 });
  }
}


export async function PUT(req: Request,   context: { params: Promise<{ slug: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.adminrole !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  
    const slug = (await context.params).slug;
    const client = await pool.connect();
  
    try {
      const body = await req.json();
      const {
        title, excerpt, content, author_name, author_role,
        author_image, image_url, category, tags,
        is_featured, is_published, read_time,
        new_slug, // optional — rename the slug
      } = body;
  
      const { rows } = await client.query(
        `UPDATE blog_posts SET
          slug         = COALESCE($1, slug),
          title        = COALESCE($2, title),
          excerpt      = COALESCE($3, excerpt),
          content      = COALESCE($4, content),
          author_name  = COALESCE($5, author_name),
          author_role  = COALESCE($6, author_role),
          author_image = COALESCE($7, author_image),
          image_url    = COALESCE($8, image_url),
          category     = COALESCE($9, category),
          tags         = COALESCE($10, tags),
          is_featured  = COALESCE($11, is_featured),
          is_published = COALESCE($12, is_published),
          read_time    = COALESCE($13, read_time),
          published_at = CASE
            WHEN $12 = true  AND published_at IS NULL THEN NOW()
            WHEN $12 = false THEN NULL
            ELSE published_at
          END
        WHERE slug = $14
        RETURNING *`,
        [
          new_slug ?? null,
          title    ?? null,
          excerpt  ?? null,
          content  ?? null,
          author_name  ?? null,
          author_role  ?? null,
          author_image ?? null,
          image_url    ?? null,
          category     ?? null,
          tags         ?? null,
          is_featured  ?? null,
          is_published ?? null,
          read_time    ?? null,
          slug,
        ]
      );
  
      if (!rows[0]) {
        return NextResponse.json({ message: "Post not found" }, { status: 404 });
      }
  
      revalidateTag("blog-posts","default");
      return NextResponse.json(rows[0]);
    } catch (err: unknown) {
      if ((err as { code?: string }).code === "23505") {
        return NextResponse.json({ message: "Slug already exists" }, { status: 409 });
      }
      console.error(err);
      return NextResponse.json({ message: "Failed to update post" }, { status: 500 });
    } finally {
      client.release();
    }
  }
  
  
  export async function DELETE(_req: Request, context: { params: Promise<{ slug: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.adminrole !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  
    const slug = (await context.params).slug;
    const client = await pool.connect();
  
    try {
      const { rowCount } = await client.query(
        `DELETE FROM blog_posts WHERE slug = $1`,
        [slug]
      );
  
      if (!rowCount) {
        return NextResponse.json({ message: "Post not found" }, { status: 404 });
      }
  
      revalidateTag("blog-posts","default");
      return NextResponse.json({ message: "Post deleted" });
    } catch (err) {
      console.error(err);
      return NextResponse.json({ message: "Failed to delete post" }, { status: 500 });
    } finally {
      client.release();
    }
  }