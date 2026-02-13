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
    const { name, issuing_organization } = body;

    if (!name || !issuing_organization) {
      return NextResponse.json(
        { error: "Name and issuing organization are required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `UPDATE public.user_accreditations 
       SET name = $1, issuing_organization = $2, updated_at = NOW() 
       WHERE id = $3 AND user_id = $4 
       RETURNING id, user_id, name, issuing_organization, display_order, created_at, updated_at`,
      [
        name.trim(),
        issuing_organization.trim(),
        id,
        session.user.id
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Accreditation not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ accreditation: result.rows[0] });
  } catch (error) {
    console.error("Error updating accreditation:", error);
    return NextResponse.json(
      { error: "Failed to update accreditation" },
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
    const {id} = await context.params
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const result = await pool.query(
      `DELETE FROM public.user_accreditations 
       WHERE id = $1 AND user_id = $2 
       RETURNING id, name`,
      [id, session.user.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Accreditation not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      id,
      name: result.rows[0].name
    });
  } catch (error) {
    console.error("Error deleting accreditation:", error);
    return NextResponse.json(
      { error: "Failed to delete accreditation" },
      { status: 500 }
    );
  }
}