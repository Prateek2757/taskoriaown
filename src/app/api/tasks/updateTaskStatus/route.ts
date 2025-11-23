import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";

interface StatusRequestBody {
  taskId?: string | number;
  status?: string;
  closeReason?:string;
  questions?:any;
}

export async function PUT(req: Request) {
  try {
    const body: StatusRequestBody = await req.json();
    const { taskId, status , closeReason,questions } = body;

    if (!taskId || !status ) {
      return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
    }
    let closeFeedback = null;
    if (status === "Closed") {
      closeFeedback = {
        q1: questions?.q1 || null,
        q2: questions?.q2 || null,
        q3: questions?.q3 || null,
        comments: closeReason || null,
        closed_at: new Date().toISOString(),
      };
    }
    const client = await pool.connect();

    const result = await client.query(
      `UPDATE tasks SET status = $1  , close_feedback = $2 WHERE task_id = $3 RETURNING *`,
      [status, closeFeedback ,taskId ]
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