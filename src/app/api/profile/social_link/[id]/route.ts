import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/options";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const {id}=await context.params
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { url, username, label, is_visible } = body;

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `UPDATE public.user_social_links 
       SET url = $1, username = $2, is_visible = $3, updated_at = NOW() 
       WHERE id = $4 AND user_id = $5
       RETURNING id, user_id, platform, url, username, display_order, is_visible, created_at, updated_at`,
      [
        url.trim(),
        username?.trim() || null,
        is_visible !== undefined ? is_visible : true,
        id,
        session.user.id
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Social link not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ socialLink: result.rows[0] });
  } catch (error) {
    console.error("Error updating social link:", error);
    return NextResponse.json(
      { error: "Failed to update social link" },
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
      `DELETE FROM public.user_social_links 
       WHERE id = $1 AND user_id = $2 
       RETURNING id, platform`,
      [id, session.user.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Social link not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      id,
      platform: result.rows[0].platform
    });
  } catch (error) {
    console.error("Error deleting social link:", error);
    return NextResponse.json(
      { error: "Failed to delete social link" },
      { status: 500 }
    );
  }
}