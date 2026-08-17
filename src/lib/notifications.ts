import "server-only";
import pool from "@/lib/dbConnect";

type CreateNotificationParams = {
  userId: string;
  title: string;
  body: string;
  role?: string;
  channel?: "inapp" | "email" | "push";
  type?:
    | "post"
    | "comment"
    | "request"
    | "file"
    | "system"
    | "message"
    | "lead_purchased"
    | "lead_response"
    | "task_posted"
    | "contact_submission";
  user_name?: string;
  action_url?: string;
};

export async function createNotification({
  userId,
  title,
  body,
  channel = "inapp",
  type,
  user_name,
  action_url,
  role,
}: CreateNotificationParams) {
  const { rows } = await pool.query(
    `INSERT INTO notifications
      (user_id, title, body, channel, type, user_name, action_url, role, is_read, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, FALSE, NOW())
     RETURNING *`,
    [userId, title, body, channel, type ?? null, user_name ?? null, action_url ?? null, role ?? null]
  );

  return rows[0];
}
