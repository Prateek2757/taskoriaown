
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(req: NextRequest, { params }: { params: { taskid: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const taskId = (await params).taskid;

console.log(taskId);

    if (!taskId) {
      return NextResponse.json({ error: "Missing taskId" }, { status: 400 });
    }

    const result = await pool.query(
      `SELECT id FROM conversations WHERE task_id = $1 LIMIT 1`,
      [taskId]
    );

    if (result.rows.length > 0) {
      return NextResponse.json({ conversationId: result.rows[0].id });
    }

    return NextResponse.json({ conversationId: null });
  } catch (error) {
    console.error("Error checking conversation:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}