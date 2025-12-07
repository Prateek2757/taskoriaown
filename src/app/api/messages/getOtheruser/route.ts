// // app/api/conversations/get-other-user/route.ts

// import { NextRequest, NextResponse } from "next/server";
// import  getServerSession  from "next-auth";
// import { Pool } from "pg";
// import { authOptions } from "@/app/api/auth/[...nextauth]/options";

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

// export async function GET(req: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { searchParams } = new URL(req.url);
//     const taskId = searchParams.get("taskId");
//     const myId = session.user.id;

//     if (!taskId) {
//       return NextResponse.json({ error: "Missing taskId" }, { status: 400 });
//     }

//     // 🔒 SECURITY CHECK 1: Verify user has purchased this lead
//     const purchaseCheck = await pool.query(
//       `SELECT id FROM task_responses
//        WHERE task_id = $1 AND professional_id = $2 AND purchased = true
//        LIMIT 1`,
//       [taskId, myId]
//     );

//     // Also check if user is the task owner (customer)
//     const ownerCheck = await pool.query(
//       `SELECT user_id FROM tasks WHERE id = $1 LIMIT 1`,
//       [taskId]
//     );

//     const isOwner = ownerCheck.rows.length > 0 && ownerCheck.rows[0].customer_id === myId;
//     const hasPurchased = purchaseCheck.rows.length > 0;

//     // User must EITHER be the task owner OR have purchased the lead
//     if (!isOwner && !hasPurchased) {
//       return NextResponse.json({
//         error: "Access denied. You must purchase this lead first."
//       }, { status: 403 });
//     }

//     // Get the conversation for this task
//     const conversationQuery = await pool.query(
//       `SELECT id FROM conversations WHERE task_id = $1 LIMIT 1`,
//       [taskId]
//     );

//     if (conversationQuery.rows.length === 0) {
//       return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
//     }

//     const conversationId = conversationQuery.rows[0].id;

//     // 🔒 SECURITY CHECK 2: Verify I am a participant in this conversation
//     const participantCheck = await pool.query(
//       `SELECT user_id FROM conversation_participants
//        WHERE conversation_id = $1 AND user_id = $2`,
//       [conversationId, myId]
//     );

//     if (participantCheck.rows.length === 0) {
//       return NextResponse.json({
//         error: "Access denied. You are not part of this conversation."
//       }, { status: 403 });
//     }

//     // Get the OTHER participant (not me)
//     const participantsQuery = await pool.query(
//       `SELECT user_id
//        FROM conversation_participants
//        WHERE conversation_id = $1 AND user_id != $2
//        LIMIT 1`,
//       [conversationId, myId]
//     );

//     if (participantsQuery.rows.length === 0) {
//       return NextResponse.json({ error: "Other user not found" }, { status: 404 });
//     }

//     const otherUserId = participantsQuery.rows[0].user_id;

//     return NextResponse.json({ otherUserId });
//   } catch (error) {
//     console.error("Error getting other user:", error);
//     return NextResponse.json({ error: "Internal error" }, { status: 500 });
//   }
// }
