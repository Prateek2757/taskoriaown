import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import pool from "@/lib/dbConnect";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;

  try {
    const client = await pool.connect();

    const query = `
      SELECT 
        c.id,
        c.task_id , 
        c.created_at,
        t.title AS task_title,
        json_agg(
          json_build_object(
            'user_id', up.user_id,
            'name', up.display_name
          )
        ) AS participants
      FROM conversations c
      JOIN conversation_participants cp 
        ON cp.conversation_id = c.id
      JOIN user_profiles up 
        ON up.user_id::text = cp.user_id   -- cast to match types (since cp.user_id is text)
      LEFT JOIN tasks t 
        ON t.task_id = c.task_id
      WHERE c.id IN (
        SELECT conversation_id
        FROM conversation_participants
        WHERE user_id = $1::text           -- cast userId to text for matching
      )
      GROUP BY c.id, t.title
      ORDER BY c.created_at DESC;
    `;

    const result = await client.query(query, [userId]);
    client.release();

    return NextResponse.json({ conversations: result.rows });
  } catch (err) {
    console.error("Fetch my conversations error:", err);
    return NextResponse.json(
      { error: "Failed to load conversations" },
      { status: 500 }
    );
  }
}