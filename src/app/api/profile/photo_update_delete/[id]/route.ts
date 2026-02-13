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
    const {id} = await context.params
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, is_featured } = body;

    const result = await pool.query(
      `UPDATE public.user_profile_photos 
       SET title = $1, description = $2, is_featured = $3, updated_at = NOW() 
       WHERE id = $4 AND user_id = $5 
       RETURNING id, user_id, photo_url, title, description, display_order, is_featured, created_at, updated_at`,
      [
        title?.trim() || null, 
        description?.trim() || null, 
        is_featured || false,
       id, 
        session.user.id
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Photo not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ photo: result.rows[0] });
  } catch (error) {
    console.error("Error updating photo:", error);
    return NextResponse.json(
      { error: "Failed to update photo" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a specific photo
export async function DELETE(
  request: Request,
  context : { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
     const {id} = await context.params
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const result = await pool.query(
      `DELETE FROM public.user_profile_photos 
       WHERE id = $1 AND user_id = $2 
       RETURNING id, photo_url`,
      [id, session.user.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Photo not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      id:id ,
      photo_url: result.rows[0].photo_url 
    });
  } catch (error) {
    console.error("Error deleting photo:", error);
    return NextResponse.json(
      { error: "Failed to delete photo" },
      { status: 500 }
    );
  }
}