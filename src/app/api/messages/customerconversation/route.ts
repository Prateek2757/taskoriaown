import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import pool from "@/lib/dbConnect";
import { getServerSession } from "next-auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const client = await pool.connect();

    const query = `
      SELECT
  c.id,
  c.task_id,
  c.created_at,

  t.title AS task_title,

  COALESCE(cu.unread_count, 0) AS unread_count,

  lm.content AS last_message,
  lm.created_at AS last_message_at,

  json_agg(
    json_build_object(
      'user_id', up.user_id,
      'name', up.display_name,
      'profile_image',up.profile_image_url
    )
  ) AS participants

FROM conversations c

JOIN tasks t
  ON t.task_id = c.task_id

JOIN conversation_participants cp
  ON cp.conversation_id = c.id
    AND cp.user_id <> $1          -- ✅ exclude current user


JOIN user_profiles up
  ON up.user_id::text = cp.user_id

LEFT JOIN conversation_unreads cu
  ON cu.conversation_id = c.id
  AND cu.user_id = $1

LEFT JOIN LATERAL (
  SELECT content, created_at
  FROM messages
  WHERE conversation_id = c.id
  ORDER BY created_at DESC
  LIMIT 1
) lm ON TRUE

WHERE t.customer_id = $1::BIGINT

GROUP BY
  c.id, t.title, cu.unread_count, lm.content, lm.created_at

ORDER BY lm.created_at DESC NULLS LAST;
    `;

    const result = await client.query(query, [userId]);
    client.release();

    return NextResponse.json({ conversations: result.rows });
  } catch (err) {
    console.error("Customer conversations error:", err);
    return NextResponse.json(
      { error: "Failed to fetch customer conversations" },
      { status: 500 }
    );
  }
}
