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
      `SELECT id, user_id, title, description, created_at, updated_at 
       FROM public.user_profile_services 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [session.user.id]
    );

    return NextResponse.json({ services: result.rows });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
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
    const { title, description } = body;

    if (!title || title.trim().length === 0) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO public.user_profile_services (user_id, title, description) 
       VALUES ($1, $2, $3) 
       RETURNING id, user_id, title, description, created_at, updated_at`,
      [session.user.id, title.trim(), description?.trim() || null]
    );

    return NextResponse.json({ service: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      { error: "Failed to create service" },
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
    const { services } = body;

    if (!Array.isArray(services)) {
      return NextResponse.json(
        { error: "Services must be an array" },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      await client.query(
        'DELETE FROM public.user_profile_services WHERE user_id = $1',
        [session.user.id]
      );

      const insertedServices = [];
      for (const service of services) {
        if (!service.title || service.title.trim().length === 0) {
          continue;
        }

        const result = await client.query(
          `INSERT INTO public.user_profile_services (user_id, title, description) 
           VALUES ($1, $2, $3) 
           RETURNING id, user_id, title, description, created_at, updated_at`,
          [session.user.id, service.title.trim(), service.description?.trim() || null]
        );
        
        insertedServices.push(result.rows[0]);
      }

      await client.query('COMMIT');

      return NextResponse.json({ services: insertedServices });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error updating services:", error);
    return NextResponse.json(
      { error: "Failed to update services" },
      { status: 500 }
    );
  }
}