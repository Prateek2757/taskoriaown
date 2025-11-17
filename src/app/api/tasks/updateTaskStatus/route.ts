import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";

interface StatusRequestBody {
  taskId?: string | number;
  status?: string;
}

export async function PUT(req: Request) {
  try {
    const body: StatusRequestBody = await req.json();
    const { taskId, status } = body;

    if (!taskId || !status) {
      return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
    }

    const client = await pool.connect();

    const result = await client.query(
      `UPDATE tasks SET status = $1 WHERE task_id = $2 RETURNING *`,
      [status, taskId]
    );

    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Status updated",
      task: result.rows[0],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}