import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const creatorId = session.user.id;
  const body = await req.json();
  const { title = null, participantIds = [], taskId } = body;

  if (!taskId) {
    return NextResponse.json(
      { message: "taskId is required" },
      { status: 400 }
    );
  }

  const uniqueIds = Array.from(
    new Set([creatorId, ...(participantIds || [])])
  ).sort();

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const purchaseCheck = await client.query(
      `SELECT 1 FROM task_responses 
       WHERE task_id = $1 AND professional_id = $2 
       LIMIT 1`,
      [taskId, creatorId]
    );

    const taskOwner = await client.query(
      `SELECT customer_id FROM tasks WHERE task_id = $1 LIMIT 1`,
      [taskId]
    );

    if (taskOwner.rows.length === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    const isTaskOwner = taskOwner.rows[0]?.customer_id === creatorId;
    const hasPurchased = purchaseCheck.rowCount && purchaseCheck.rowCount > 0;

    if (!hasPurchased && !isTaskOwner) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { message: "You must purchase this lead to start a conversation." },
        { status: 403 }
      );
    }

    const otherUserIds = uniqueIds.filter((id) => id !== creatorId);

    for (const otherUserId of otherUserIds) {
      const otherPurchaseCheck = await client.query(
        `SELECT 1 FROM task_responses 
         WHERE task_id = $1 AND professional_id = $2 
         LIMIT 1`,
        [taskId, otherUserId]
      );

      const otherIsOwner = taskOwner.rows[0]?.customer_id === otherUserId;
      const otherHasPurchased =
        otherPurchaseCheck.rowCount && otherPurchaseCheck.rowCount > 0;

      if (!otherHasPurchased && !otherIsOwner) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          { message: "Other participant has not purchased this lead." },
          { status: 403 }
        );
      }
    }

    // Check if conversation already exists
    const res = await client.query(
      `SELECT c.id
       FROM conversations c
       WHERE c.id IN (
         SELECT cp.conversation_id
         FROM conversation_participants cp
         GROUP BY cp.conversation_id
         HAVING array_agg(cp.user_id ORDER BY cp.user_id) = $2::text[]
       )
       AND c.is_private = true
       AND c.task_id = $1
       LIMIT 1
       FOR UPDATE`,
      [taskId, uniqueIds]
    );

    let conversation;

    if ((res.rowCount ?? 0) > 0) {
      conversation = { id: res.rows[0].id };
    } else {
      const insertConv = await client.query(
        `INSERT INTO conversations (title, is_private, created_by, task_id) 
         VALUES ($1, true, $2, $3) 
         RETURNING *`,
        [title, creatorId, taskId]
      );
      conversation = insertConv.rows[0];

      await client.query(
        `INSERT INTO conversation_participants (conversation_id, user_id)
         SELECT $1, unnest($2::text[])
         ON CONFLICT DO NOTHING`,
        [conversation.id, uniqueIds]
      );

      await client.query(
        `INSERT INTO conversation_unreads (conversation_id, user_id, unread_count, last_read_at)
         SELECT $1, unnest($2::text[]), 0, now()
         ON CONFLICT (conversation_id, user_id) DO NOTHING`,
        [conversation.id, uniqueIds]
      );
    }

    await client.query("COMMIT");
    return NextResponse.json({ conversation }, { status: 201 });
  } catch (err: any) {
    await client.query("ROLLBACK");
    console.error("create conversation failed", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    client.release();
  }
}
