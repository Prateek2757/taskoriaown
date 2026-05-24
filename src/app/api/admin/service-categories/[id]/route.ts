import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import pool from "@/lib/dbConnect";


async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.adminrole !== "admin") return null;
  return session;
}


type Params = { params: Promise<{ id: string }> };



export async function GET(_req: Request, { params }: Params) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const categoryId = Number(id);

  if (!Number.isInteger(categoryId) || categoryId < 1) {
    return NextResponse.json({ message: "Invalid category id" }, { status: 400 });
  }

  try {
    const { rows } = await pool.query(
      `SELECT
         c.category_id,
         c.parent_category_id,
         c.name,
         c.slug,
         c.description,
         c.is_active,
         c.remote_available,
         c.rank,
         c.public_id,
         c.main_category,
         c.faqs,
         c.service_detail,
         c.keywords,
         c.image_url,
         c.created_at,
         c.updated_at,
         COALESCE(
           JSON_AGG(
             JSON_BUILD_OBJECT(
               'category_question_id', q.category_question_id,
               'question',             q.question,
               'field_type',           q.field_type,
               'options',              q.options,
               'is_required',          q.is_required,
               'sort_order',           q.sort_order
             )
             ORDER BY q.sort_order ASC
           ) FILTER (WHERE q.category_question_id IS NOT NULL),
           '[]'
         ) AS questions
       FROM service_categories c
       LEFT JOIN category_questions q USING (category_id)
       WHERE c.category_id = $1
       GROUP BY c.category_id`,
      [categoryId]
    );

    if (rows.length === 0) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error(`[GET /api/categories/${id}]`, err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}


export async function PUT(request: Request, { params }: Params) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const categoryId = Number(id);

  if (!Number.isInteger(categoryId) || categoryId < 1) {
    return NextResponse.json({ message: "Invalid category id" }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const {
    name,
    slug,
    description = "",
    main_category = "",
    parent_category_id = null,
    is_active = true,
    remote_available = false,
    rank,
    image_url = "",
    service_detail = "",
    keywords = [],
    faqs = [],
    questions = [],
  } = body as {
    name: string;
    slug: string;
    description?: string;
    main_category?: string;
    parent_category_id?: number | null;
    is_active?: boolean;
    remote_available?: boolean;
    rank?: number;
    image_url?: string;
    service_detail?: string;
    keywords?: string[];
    faqs?: { question: string; answer: string }[];
    questions?: {
      category_question_id?: number;
      question: string;
      field_type: string;
      options: string[];
      is_required: boolean;
      sort_order: number;
    }[];
  };

  if (!name?.trim()) {
    return NextResponse.json({ message: "name is required" }, { status: 400 });
  }
  if (!slug?.trim()) {
    return NextResponse.json({ message: "slug is required" }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { rowCount } = await client.query(
      `UPDATE service_categories SET
         name               = $1,
         slug               = $2,
         description        = $3,
         main_category      = $4,
         parent_category_id = $5,
         is_active          = $6,
         remote_available   = $7,
         rank               = $8,
         image_url          = $9,
         service_detail     = $10,
         keywords           = $11,
         faqs               = $12,
         updated_at         = NOW()
       WHERE category_id = $13`,
      [
        name.trim(),
        slug.trim(),
        description,
        main_category,
        parent_category_id,
        is_active,
        remote_available,
        rank,
        image_url,
        service_detail,
        keywords,
        JSON.stringify(faqs),
        categoryId,
      ]
    );

    if (!rowCount) {
      await client.query("ROLLBACK");
      return NextResponse.json({ message: "Category not found" }, { status: 404 });
    }

    // 2. Replace questions: wipe existing, re-insert from payload
    await client.query(
      `DELETE FROM category_questions WHERE category_id = $1`,
      [categoryId]
    );

    if (Array.isArray(questions) && questions.length > 0) {
      const values = questions.map((_, i) => {
        const base = i * 6;
        return `($${base + 1},$${base + 2},$${base + 3},$${base + 4},$${base + 5},$${base + 6})`;
      });

      const params = questions.flatMap((q, i) => [
        categoryId,
        q.question,
        q.field_type,
        JSON.stringify(q.options ?? []),
        q.is_required ?? true,
        q.sort_order ?? i + 1,
      ]);
      await client.query(
        `INSERT INTO category_questions
           (category_id, question, field_type, options, is_required, sort_order)
         VALUES ${values.join(",")}`,
        params
      );
    }

    await client.query("COMMIT");

    revalidateTag("categories","default");

    return NextResponse.json({ message: "Category updated" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(`[PUT /api/categories/${id}]`, err);

    if ((err as { code?: string }).code === "23505") {
      return NextResponse.json(
        { message: "A category with this slug already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}


export async function DELETE(_req: Request, { params }: Params) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const categoryId = Number(id);

  if (!Number.isInteger(categoryId) || categoryId < 1) {
    return NextResponse.json({ message: "Invalid category id" }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Remove questions first (safe even if FK has CASCADE)
    await client.query(
      `DELETE FROM category_questions WHERE category_id = $1`,
      [categoryId]
    );

    const { rowCount } = await client.query(
      `DELETE FROM service_categories WHERE category_id = $1`,
      [categoryId]
    );

    if (!rowCount) {
      await client.query("ROLLBACK");
      return NextResponse.json({ message: "Category not found" }, { status: 404 });
    }

    await client.query("COMMIT");

    revalidateTag("categories","default");

    return NextResponse.json({ message: "Category deleted" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(`[DELETE /api/categories/${id}]`, err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}