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
      `SELECT id, user_id, platform, url, username, display_order, is_visible, created_at, updated_at 
       FROM public.user_social_links 
       WHERE user_id = $1 
       ORDER BY display_order ASC, created_at DESC`,
      [session.user.id]
    );

    return NextResponse.json({ socialLinks: result.rows });
  } catch (error) {
    console.error("Error fetching social links:", error);
    return NextResponse.json(
      { error: "Failed to fetch social links" },
      { status: 500 }
    );
  }
}

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
    const { platform, url, username, is_visible } = body;

    if (!platform || !url) {
      return NextResponse.json(
        { error: "Platform and URL are required" },
        { status: 400 }
      );
    }

    const existingResult = await pool.query(
      `SELECT id FROM public.user_social_links 
       WHERE user_id = $1 AND platform = $2`,
      [session.user.id, platform]
    );

    if (existingResult.rows.length > 0) {
      return NextResponse.json(
        { error: `You already have a ${platform} link. Please update it instead.` },
        { status: 400 }
      );
    }

    const orderResult = await pool.query(
      `SELECT COALESCE(MAX(display_order), 0) + 1 as next_order 
       FROM public.user_social_links 
       WHERE user_id = $1`,
      [session.user.id]
    );

    const nextOrder = orderResult.rows[0].next_order;

    const result = await pool.query(
      `INSERT INTO public.user_social_links 
       (user_id, platform, url, username, display_order, is_visible) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, user_id, platform, url, username, display_order, is_visible, created_at, updated_at`,
      [
        session.user.id,
        platform.toLowerCase(),
        url.trim(),
        username?.trim() || null,
        nextOrder,
        is_visible !== undefined ? is_visible : true
      ]
    );

    return NextResponse.json({ socialLink: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating social link:", error);
    return NextResponse.json(
      { error: "Failed to create social link" },
      { status: 500 }
    );
  }
}

// PUT - Reorder social links
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
    const { linkOrders } = body; // Array of { id, display_order }

    if (!Array.isArray(linkOrders)) {
      return NextResponse.json(
        { error: "Link orders must be an array" },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      for (const item of linkOrders) {
        await client.query(
          `UPDATE public.user_social_links 
           SET display_order = $1, updated_at = NOW() 
           WHERE id = $2 AND user_id = $3`,
          [item.display_order, item.id, session.user.id]
        );
      }

      await client.query('COMMIT');

      // Fetch updated links
      const result = await client.query(
        `SELECT id, user_id, platform, url, username, display_order, is_visible, created_at, updated_at 
         FROM public.user_social_links 
         WHERE user_id = $1 
         ORDER BY display_order ASC, created_at DESC`,
        [session.user.id]
      );

      return NextResponse.json({ socialLinks: result.rows });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error reordering social links:", error);
    return NextResponse.json(
      { error: "Failed to reorder social links" },
      { status: 500 }
    );
  }
}