// import { NextResponse } from "next/server";
// import pool from "@/lib/dbConnect";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/options";

// export async function GET() {
//   const session = await getServerSession(authOptions);
//   if (!session?.user?.id)
//     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

//   const userId = session.user.id;
//   const client = await pool.connect();

//   try {
//     const res = await client.query(
//       `
//       SELECT 
//   c.*, 
//   t.title AS task_title,
//   json_agg(cp.user_id) AS participant_ids
// FROM conversations c
// JOIN conversation_participants cp ON cp.conversation_id = c.id
// LEFT JOIN tasks t ON t.task_id = c.task_id
// WHERE cp.user_id = $1
// GROUP BY c.id, t.title
// ORDER BY c.created_at DESC;
//       `,
//       [userId]
//     );

//     return NextResponse.json({ conversations: res.rows });
//   } catch (err: any) {
//     console.error(err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   } finally {
//     client.release();
//   }
// }
