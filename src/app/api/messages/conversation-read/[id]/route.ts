import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Pool } from "pg";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conversationId = (await params).id;

    const myId = session.user.id;

    if (!conversationId) {
      return NextResponse.json(
        { error: "Missing conversation ID" },
        { status: 400 }
      );
    }

    const participantCheck = await pool.query(
      `SELECT user_id FROM conversation_participants 
       WHERE conversation_id = $1 AND user_id = $2`,
      [conversationId, myId]
    );

    if (participantCheck.rows.length === 0) {
      return NextResponse.json(
        {
          error: "Access denied. You are not part of this conversation.",
        },
        { status: 403 }
      );
    }

    const taskCheck = await pool.query(
      `SELECT task_id FROM conversations WHERE id = $1`,
      [conversationId]
    );

    if (taskCheck.rows.length === 0) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    const taskId = taskCheck.rows[0].task_id;

    const purchaseCheck = await pool.query(
      `SELECT task_id FROM task_responses 
       WHERE task_id = $1 AND professional_id = $2 
       LIMIT 1`,
      [taskId, myId]
    );

    const ownerCheck = await pool.query(
      `SELECT customer_id FROM tasks WHERE task_id = $1 LIMIT 1`,
      [taskId]
    );

    const isOwner =
      ownerCheck.rows.length > 0 && ownerCheck.rows[0].customer_id === myId;
    const hasPurchased = purchaseCheck.rows.length > 0;

    if (!isOwner && !hasPurchased) {
      return NextResponse.json(
        {
          error: "Access denied. Lead must be purchased to view messages.",
        },
        { status: 403 }
      );
    }

    const messagesResult = await pool.query(
      `SELECT id, conversation_id, user_id, content, created_at 
       FROM messages 
       WHERE conversation_id = $1 
       ORDER BY created_at ASC`,
      [conversationId]
    );

    await pool.query(
      `UPDATE conversation_participants 
       SET last_seen_at = NOW() 
       WHERE conversation_id = $1 AND user_id = $2`,
      [conversationId, myId]
    );

    return NextResponse.json({
      messages: messagesResult.rows,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
