import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/options"
import pool from "@/lib/dbConnect"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { rows } = await pool.query(
      `SELECT notification_id, title, body, is_read, created_at, type, action_url, role, user_name
       FROM notifications
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 20`,
      [session.user.id]
    )

    return Response.json(rows)
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return Response.json({ error: "Failed to fetch notifications" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { notificationId } = await req.json()

  try {
    await pool.query(
      `UPDATE notifications
       SET is_read = TRUE
       WHERE notification_id = $1 AND user_id = $2`,
      [notificationId, session.user.id]
    )
  } catch (error) {
    console.error("Error marking notification as read:", error)
    return Response.json({ error: "Failed to update notification" }, { status: 500 })
  }

  return Response.json({ success: true })
}
