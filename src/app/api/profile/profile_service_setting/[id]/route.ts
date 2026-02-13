import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/options";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description } = body;

    if (!title || title.trim().length === 0) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const result = await pool.query(
      `UPDATE public.user_profile_services 
       SET title = $1, description = $2, updated_at = NOW() 
       WHERE id = $3 AND user_id = $4 
       RETURNING id, user_id, title, description, created_at, updated_at`,
      [title.trim(), description?.trim() || null, id, session.user.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Service not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ service: result.rows[0] });
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json(
      { error: "Failed to update service" },
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
    const { id } = await context.params;
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await pool.query(
      `DELETE FROM public.user_profile_services 
       WHERE id = $1 AND user_id = $2 
       RETURNING id`,
      [id, session.user.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Service not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, id:id });
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json(
      { error: "Failed to delete service" },
      { status: 500 }
    );
  }
}
