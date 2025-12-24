import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const client = await pool.connect();

    const query = `
      SELECT task_id, title, description, status, created_at, budget_min, budget_max ,estimated_budget
      FROM tasks
      WHERE customer_id = $1
      AND is_deleted = false
      ORDER BY created_at DESC
    `;

    const result = await client.query(query, [userId]);
    client.release();

    return NextResponse.json({ tasks: result.rows });
  } catch (err) {
    console.error("Fetch customer tasks error:", err);
    return NextResponse.json(
      { error: "Failed to load tasks" },
      { status: 500 }
    );
  }
}
