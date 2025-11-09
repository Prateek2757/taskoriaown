import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } } 
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;
  const conversationId = params.id; 

  const client = await pool.connect();
  try {

    const partRes = await client.query(
      `SELECT 1 FROM conversation_participants WHERE conversation_id = $1 AND user_id = $2`,
      [conversationId, userId]
    );
    if (partRes.rowCount === 0)
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const msgRes = await client.query(
      `SELECT * FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC`,
      [conversationId]
    );

    return NextResponse.json({ messages: msgRes.rows });
  } catch (err: any) {
    console.error("GET conversation-read failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;
  const conversationId = params.id;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(
      `INSERT INTO conversation_unreads (conversation_id, user_id, unread_count, last_read_at)
       VALUES ($1, $2, 0, now())
       ON CONFLICT (conversation_id, user_id) DO UPDATE SET unread_count = 0, last_read_at = now()`,
      [conversationId, userId]
    );

    await client.query("COMMIT");
    return NextResponse.json({ success: true });
  } catch (err: any) {
    await client.query("ROLLBACK");
    console.error("POST conversation-read failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    client.release();
  }
}
