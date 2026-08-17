import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { createNotification } from "@/lib/notifications";

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

    const partRes = await client.query<{ user_id: string; role: string | null }>(
      `SELECT user_id, role
       FROM conversation_participants
       WHERE conversation_id = $1`,
      [conversation_id]
    );

    if (!partRes.rows.some((participant) => participant.user_id === senderId)) {
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
    // const updateRes = await client.query(
    //   `UPDATE conversation_unreads
    //    SET unread_count = unread_count
    //    WHERE conversation_id = $1 AND user_id != $2
    //    RETURNING *`,
    //   [conversation_id, senderId]
    // );

    //  // console.log("Unread updated rows:", updateRes.rowCount);

    await client.query("COMMIT");

    const senderName = session.user.name?.trim() || "Someone";
    const notificationJobs = partRes.rows
      .filter((participant) => participant.user_id !== senderId)
      .map((participant) =>
        createNotification({
          userId: participant.user_id,
          type: "message",
          user_name: senderName,
          title: `${senderName} is messaging you`,
          body: `You have received a message from ${senderName}`,
          action_url: `/messages/${conversation_id}`,
          role: participant.role ?? undefined,
        })
      );

    const deliveryJobs: Promise<unknown>[] = [...notificationJobs];

    try {
      // Create the server client only while handling a request. API route modules are
      // evaluated during `next build`, when runtime secrets may not be available.
      const channel = getSupabaseAdmin().channel(`conversation:${conversation_id}`);
      deliveryJobs.push(
        channel.send({
          type: "broadcast",
          event: "message",
          payload: { message },
        })
      );
    } catch (error) {
      console.error("Unable to initialize message broadcast:", error);
    }

    const deliveryResults = await Promise.allSettled(deliveryJobs);
    deliveryResults.forEach((result) => {
      if (result.status === "rejected") {
        console.error("Message notification delivery failed:", result.reason);
      }
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
