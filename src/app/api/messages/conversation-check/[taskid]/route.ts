
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

    const taskId = params.taskid;
    const userId = session.user.id;

    const participantIds = req.nextUrl.searchParams.get("participants")?.split(",") || [];

    if (!taskId) {
      return NextResponse.json({ error: "Missing taskId" }, { status: 400 });
    }

    const convRes = await pool.query(
      `SELECT id FROM conversations WHERE task_id = $1`,
      [taskId]
    );

    if (convRes.rows.length === 0) {
      return NextResponse.json({ conversationId: null });
    }

    for (const conv of convRes.rows) {
      const partRes = await pool.query(
        `SELECT user_id FROM conversation_participants WHERE conversation_id = $1`,
        [conv.id]
      );

      const dbParticipants = partRes.rows.map(r => r.user_id).sort();
      const clientParticipants = [...participantIds, userId].sort();

      if (
        dbParticipants.length === clientParticipants.length &&
        dbParticipants.every((v, i) => v === clientParticipants[i])
      ) {
        return NextResponse.json({ conversationId: conv.id });
      }
    }

    return NextResponse.json({ conversationId: null });

  } catch (error) {
    console.error("Error checking conversation:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
