// app/api/messages/create-conversation/route.ts
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
  const { title = null, participantIds = [] } = body; // participants array

  // Include creator
  const uniqueIds = Array.from(new Set([creatorId, ...(participantIds || [])]));

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1️⃣ Check if conversation already exists
    const res = await client.query(
      `
      SELECT c.id
      FROM conversations c
      JOIN conversation_participants cp ON cp.conversation_id = c.id
      WHERE c.is_private = true
      GROUP BY c.id
      HAVING array_agg(cp.user_id ORDER BY cp.user_id) = $1::text[]
      `,
      [uniqueIds.sort()]
    );

    let conversation;
    if ((res.rowCount ?? 0) > 0) {
      // Use existing conversation
      conversation = { id: res.rows[0].id };
    } else {
      // Create new conversation
      const insertConv = await client.query(
        `INSERT INTO conversations (title, is_private, created_by) VALUES ($1, true, $2) RETURNING *`,
        [title, creatorId]
      );
      conversation = insertConv.rows[0];

      // Add participants
      await client.query(
        `
        INSERT INTO conversation_participants (conversation_id, user_id)
        SELECT $1, unnest($2::text[])
        ON CONFLICT DO NOTHING
        `,
        [conversation.id, uniqueIds]
      );

     
      await client.query(
        `
        INSERT INTO conversation_unreads (conversation_id, user_id, unread_count, last_read_at)
        SELECT $1, unnest($2::text[]), 0, now()
        ON CONFLICT (conversation_id, user_id) DO NOTHING
        `,
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
