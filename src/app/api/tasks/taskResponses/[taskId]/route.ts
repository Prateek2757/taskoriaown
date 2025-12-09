import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";

export async function GET(req: Request, context: { params: Promise<{ taskId: string }> }) {
  try {
    const client=await pool.connect();
    const taskId = await  Number((await context.params).taskId);
    const res = await client.query(
      `SELECT tr.*, up.display_name, up.profile_image_url , c.id,c.title
       FROM task_responses tr
       JOIN user_profiles up ON up.user_id = tr.professional_id
       LEFT JOIN conversations c ON c.task_id = tr.task_id
       WHERE tr.task_id = $1
       ORDER BY tr.created_at DESC`,
      [taskId]
    );
    return NextResponse.json({ responses: res.rows });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch responses" }, { status: 500 });
  }
}
