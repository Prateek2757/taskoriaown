import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { supabaseBrowser } from "@/lib/supabase-server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const senderId = session.user.id;
  const body = await req.json();
  const { conversation_id, content, metadata = null, taskId } = body;

  if (!conversation_id || (!content && !metadata))
    return NextResponse.json({ message: "Bad request" }, { status: 400 });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const partRes = await client.query(
      `SELECT 1 FROM conversation_participants WHERE conversation_id = $1 AND user_id = $2`,
      [conversation_id, senderId]
    );

    if (partRes.rowCount === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { message: "Forbidden: Not a participant" },
        { status: 403 }
      );
    }

    const purchaseCheck = await client.query(
      `SELECT 1 FROM task_responses 
       WHERE task_id = $1 AND professional_id = $2 
       LIMIT 1`,
      [taskId, senderId]
    );

    const taskOwner = await client.query(
      `SELECT customer_id FROM tasks WHERE task_id = $1 LIMIT 1`,
      [taskId]
    );

    const isTaskOwner = taskOwner.rows[0]?.customer_id === senderId;
    const hasPurchased = purchaseCheck.rowCount && purchaseCheck.rowCount > 0;

    if (!isTaskOwner && !hasPurchased) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { message: "You must purchase this lead to send messages." },
        { status: 403 }
      );
    }

    const insertMsg = await client.query(
      `INSERT INTO messages (conversation_id, user_id, content, metadata, task_id) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [conversation_id, senderId, content, metadata, taskId]
    );
    const message = insertMsg.rows[0];

    await client.query(
      `UPDATE conversation_unreads 
       SET unread_count = unread_count + 1 
       WHERE conversation_id = $1 AND user_id != $2`,
      [conversation_id, senderId]
    );

    await client.query("COMMIT");

    const channel = supabaseBrowser.channel(`conversation:${conversation_id}`);
    await channel.send({
      type: "broadcast",
      event: "message",
      payload: { message },
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (err: any) {
    await client.query("ROLLBACK");
    console.error("send message failed", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    client.release();
  }
}
