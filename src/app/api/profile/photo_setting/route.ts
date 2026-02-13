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
      `SELECT id, user_id, photo_url, title, description, display_order, is_featured, created_at, updated_at 
       FROM public.user_profile_photos 
       WHERE user_id = $1 
       ORDER BY display_order ASC, created_at DESC`,
      [session.user.id]
    );

    return NextResponse.json({ photos: result.rows });
  } catch (error) {
    console.error("Error fetching photos:", error);
    return NextResponse.json(
      { error: "Failed to fetch photos" },
      { status: 500 }
    );
  }
}

// POST - Create a new photo
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
    const { photo_url, title, description, is_featured } = body;

    if (!photo_url || photo_url.trim().length === 0) {
      return NextResponse.json(
        { error: "Photo URL is required" },
        { status: 400 }
      );
    }

    // Get the next display order
    const orderResult = await pool.query(
      `SELECT COALESCE(MAX(display_order), 0) + 1 as next_order 
       FROM public.user_profile_photos 
       WHERE user_id = $1`,
      [session.user.id]
    );

    const nextOrder = orderResult.rows[0].next_order;

    const result = await pool.query(
      `INSERT INTO public.user_profile_photos 
       (user_id, photo_url, title, description, display_order, is_featured) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, user_id, photo_url, title, description, display_order, is_featured, created_at, updated_at`,
      [
        session.user.id, 
        photo_url.trim(), 
        title?.trim() || null, 
        description?.trim() || null,
        nextOrder,
        is_featured || false
      ]
    );

    return NextResponse.json({ photo: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating photo:", error);
    return NextResponse.json(
      { error: "Failed to create photo" },
      { status: 500 }
    );
  }
}

// PUT - Reorder photos
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
    const { photoOrders } = body; // Array of { id, display_order }

    if (!Array.isArray(photoOrders)) {
      return NextResponse.json(
        { error: "Photo orders must be an array" },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      for (const item of photoOrders) {
        await client.query(
          `UPDATE public.user_profile_photos 
           SET display_order = $1, updated_at = NOW() 
           WHERE id = $2 AND user_id = $3`,
          [item.display_order, item.id, session.user.id]
        );
      }

      await client.query('COMMIT');

      // Fetch updated photos
      const result = await client.query(
        `SELECT id, user_id, photo_url, title, description, display_order, is_featured, created_at, updated_at 
         FROM public.user_profile_photos 
         WHERE user_id = $1 
         ORDER BY display_order ASC, created_at DESC`,
        [session.user.id]
      );

      return NextResponse.json({ photos: result.rows });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error reordering photos:", error);
    return NextResponse.json(
      { error: "Failed to reorder photos" },
      { status: 500 }
    );
  }
}