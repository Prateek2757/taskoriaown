import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params; 

  const client = await pool.connect();

  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(session.user.id);
    const taskId = Number(id);

    if (isNaN(taskId)) {
      return NextResponse.json({ message: "Invalid task ID" }, { status: 400 });
    }

    const { seen } = await req.json();

    const result = await client.query(
      `
      INSERT INTO user_task_seen (user_id, task_id, seen)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, task_id)
      DO UPDATE SET seen = EXCLUDED.seen
      RETURNING *;
      `,
      [userId, taskId, seen]
    );

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Failed to update seen status" }, { status: 500 });
  } finally {
    client.release();
  }
}