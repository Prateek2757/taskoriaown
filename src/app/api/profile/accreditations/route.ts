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
      `SELECT id, user_id, name, issuing_organization, display_order, created_at, updated_at 
       FROM public.user_accreditations 
       WHERE user_id = $1 
       ORDER BY display_order ASC, created_at DESC`,
      [session.user.id]
    );

    return NextResponse.json({ accreditations: result.rows });
  } catch (error) {
    console.error("Error fetching accreditations:", error);
    return NextResponse.json(
      { error: "Failed to fetch accreditations" },
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
    const { name, issuing_organization } = body;

    if (!name || !issuing_organization) {
      return NextResponse.json(
        { error: "Name and issuing organization are required" },
        { status: 400 }
      );
    }

    const orderResult = await pool.query(
      `SELECT COALESCE(MAX(display_order), 0) + 1 as next_order 
       FROM public.user_accreditations 
       WHERE user_id = $1`,
      [session.user.id]
    );

    const nextOrder = orderResult.rows[0].next_order;

    const result = await pool.query(
      `INSERT INTO public.user_accreditations 
       (user_id, name, issuing_organization, display_order) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, user_id, name, issuing_organization, display_order, created_at, updated_at`,
      [
        session.user.id,
        name.trim(),
        issuing_organization.trim(),
        nextOrder
      ]
    );

    return NextResponse.json({ accreditation: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating accreditation:", error);
    return NextResponse.json(
      { error: "Failed to create accreditation" },
      { status: 500 }
    );
  }
}

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
    const { accreditationOrders } = body;

    if (!Array.isArray(accreditationOrders)) {
      return NextResponse.json(
        { error: "Accreditation orders must be an array" },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      for (const item of accreditationOrders) {
        await client.query(
          `UPDATE public.user_accreditations 
           SET display_order = $1, updated_at = NOW() 
           WHERE id = $2 AND user_id = $3`,
          [item.display_order, item.id, session.user.id]
        );
      }

      await client.query('COMMIT');

      const result = await client.query(
        `SELECT id, user_id, name, issuing_organization, display_order, created_at, updated_at 
         FROM public.user_accreditations 
         WHERE user_id = $1 
         ORDER BY display_order ASC, created_at DESC`,
        [session.user.id]
      );

      return NextResponse.json({ accreditations: result.rows });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error reordering accreditations:", error);
    return NextResponse.json(
      { error: "Failed to reorder accreditations" },
      { status: 500 }
    );
  }
}