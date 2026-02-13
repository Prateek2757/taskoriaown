import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const result = await pool.query(
      `SELECT id, user_id, question, answer, category, display_order, is_visible, created_at, updated_at 
       FROM public.user_faqs 
       WHERE user_id = $1 
       ORDER BY 
         CASE WHEN category IS NULL THEN 1 ELSE 0 END,
         category ASC,
         display_order ASC, 
         created_at DESC`,
      [session.user.id]
    );

    return NextResponse.json({ faqs: result.rows });
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return NextResponse.json(
      { error: "Failed to fetch FAQs" },
      { status: 500 }
    );
  }
}

// POST - Create a new FAQ
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { question, answer, category, is_visible } = body;

    if (!question || !answer) {
      return NextResponse.json(
        { error: "Question and answer are required" },
        { status: 400 }
      );
    }

    // Get the next display order
    const orderResult = await pool.query(
      `SELECT COALESCE(MAX(display_order), 0) + 1 as next_order 
       FROM public.user_faqs 
       WHERE user_id = $1`,
      [session.user.id]
    );

    const nextOrder = orderResult.rows[0].next_order;

    const result = await pool.query(
      `INSERT INTO public.user_faqs 
       (user_id, question, answer, category, display_order, is_visible) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, user_id, question, answer, category, display_order, is_visible, created_at, updated_at`,
      [
        session.user.id,
        question.trim(),
        answer.trim(),
        category?.trim() || null,
        nextOrder,
        is_visible !== undefined ? is_visible : true
      ]
    );

    return NextResponse.json({ faq: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating FAQ:", error);
    return NextResponse.json(
      { error: "Failed to create FAQ" },
      { status: 500 }
    );
  }
}

// PUT - Reorder FAQs
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { faqOrders } = body;

    if (!Array.isArray(faqOrders)) {
      return NextResponse.json(
        { error: "FAQ orders must be an array" },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      for (const item of faqOrders) {
        await client.query(
          `UPDATE public.user_faqs 
           SET display_order = $1, updated_at = NOW() 
           WHERE id = $2 AND user_id = $3`,
          [item.display_order, item.id, session.user.id]
        );
      }

      await client.query('COMMIT');

      const result = await client.query(
        `SELECT id, user_id, question, answer, category, display_order, is_visible, created_at, updated_at 
         FROM public.user_faqs 
         WHERE user_id = $1 
         ORDER BY display_order ASC, created_at DESC`,
        [session.user.id]
      );

      return NextResponse.json({ faqs: result.rows });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error reordering FAQs:", error);
    return NextResponse.json(
      { error: "Failed to reorder FAQs" },
      { status: 500 }
    );
  }
}