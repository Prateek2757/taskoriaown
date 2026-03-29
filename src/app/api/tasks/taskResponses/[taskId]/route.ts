import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";

export async function GET(
  req: Request,
  context: { params: Promise<{ taskId: string }> }
) {
  try {
    const client = await pool.connect();
    const taskId = Number((await context.params).taskId);

    const res = await client.query(
      `SELECT
         tr.*,
         up.display_name,
         up.profile_image_url,
         u.is_email_verified AS is_verified,
         u.public_id,
         cp.slug AS company_slug,
         (featured IS NOT NULL) AS is_featured,
    
         c.id   AS message_id,
         c.title AS conversation_title
         
       FROM task_responses tr
    
       JOIN user_profiles up 
         ON up.user_id = tr.professional_id
    
       LEFT JOIN users u 
         ON u.user_id = tr.professional_id
    LEFT JOIN company cp ON cp.user_id = tr.professional_id
       LEFT JOIN LATERAL (
         SELECT 1
         FROM professional_subscriptions ps
         WHERE ps.user_id = u.user_id
           AND ps.status IN ('trialing', 'active')
           AND (ps.end_date IS NULL OR ps.end_date > NOW())
         ORDER BY ps.created_at DESC
         LIMIT 1
       ) featured ON true
    
       LEFT JOIN LATERAL (
         SELECT id, title
         FROM conversations
         WHERE task_id = tr.task_id
           AND created_by::bigint = tr.professional_id::bigint
         ORDER BY created_at DESC
         LIMIT 1
       ) c ON true
    
       WHERE tr.task_id = $1
    
       ORDER BY 
         (featured IS NOT NULL) DESC, -- 🔥 featured first
         tr.created_at DESC`,
      [taskId]
    );

    client.release();

    return NextResponse.json({ responses: res.rows });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch responses" },
      { status: 500 }
    );
  }
}