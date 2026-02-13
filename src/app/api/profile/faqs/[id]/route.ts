import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/options";

export async function PATCH(
  request: Request,
 context : { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
      const {id} = await context.params;
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

    const result = await pool.query(
      `UPDATE public.user_faqs 
       SET question = $1, answer = $2, category = $3, is_visible = $4, updated_at = NOW() 
       WHERE id = $5 AND user_id = $6 
       RETURNING id, user_id, question, answer, category, display_order, is_visible, created_at, updated_at`,
      [
        question.trim(),
        answer.trim(),
        category?.trim() || null,
        is_visible !== undefined ? is_visible : true,
        id,
        session.user.id
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "FAQ not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ faq: result.rows[0] });
  } catch (error) {
    console.error("Error updating FAQ:", error);
    return NextResponse.json(
      { error: "Failed to update FAQ" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
 context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const {id} = await context.params;
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const result = await pool.query(
      `DELETE FROM public.user_faqs 
       WHERE id = $1 AND user_id = $2 
       RETURNING id, question`,
      [id, session.user.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "FAQ not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      id,
      question: result.rows[0].question
    });
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    return NextResponse.json(
      { error: "Failed to delete FAQ" },
      { status: 500 }
    );
  }
}