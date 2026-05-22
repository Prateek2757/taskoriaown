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


export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { rows } = await pool.query<{
      category_id: number;
      parent_category_id: number | null;
      name: string;
      slug: string;
      description: string;
      is_active: boolean;
      remote_available: boolean;
      rank: number;
      public_id: string;
      main_category: string;
      faqs: unknown;
      service_detail: string;
      keywords: string[];
      image_url: string;
      created_at: string;
      updated_at: string;
      questions: unknown;
    }>(`
      SELECT
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
        -- Aggregate questions as a JSON array (empty array if none)
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
      GROUP BY c.category_id
      ORDER BY c.rank ASC, c.name ASC;
    `);

    return NextResponse.json(rows);
  } catch (err) {
    console.error("[GET /api/categories]", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}


export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
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
    rank = 1,
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

    const { rows } = await client.query<{ category_id: number }>(
      `INSERT INTO service_categories
         (name, slug, description, main_category, parent_category_id,
          is_active, remote_available, rank, image_url, service_detail,
          keywords, faqs)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       RETURNING category_id`,
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
      ]
    );

    const categoryId = rows[0].category_id;

    if (Array.isArray(questions) && questions.length > 0) {
      const values = questions.map((q, i) => {
        const base = i * 6;
        return `($${base + 1},$${base + 2},$${base + 3},$${base + 4},$${base + 5},$${base + 6})`;
      });

      const params = questions.flatMap((q, i) => [
        categoryId,
        q.question,
        q.field_type,
        q.options ?? [],
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

    return NextResponse.json(
      { message: "Category created", category_id: categoryId },
      { status: 201 }
    );
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("[POST /api/categories]", err);

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