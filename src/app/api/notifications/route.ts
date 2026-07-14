import { getServerSession } from "next-auth"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { authOptions } from "../auth/[...nextauth]/options"

export async function GET() {
  const session = await getServerSession(authOptions)
  const supabaseAdmin = getSupabaseAdmin();

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data, error } = await supabaseAdmin
    .from('notifications')
    .select('notification_id, title, body, is_read, created_at, type, action_url, role, user_name')
    .eq('user_id', Number(session.user.id))
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    console.error("Error fetching notifications:", error)
    return Response.json({ error: "Failed to fetch notifications" }, { status: 500 })
  }

  return Response.json(data ?? [])
}

export async function POST(req: Request) {
  const supabaseAdmin = getSupabaseAdmin();

  const session = await getServerSession(authOptions)
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { notificationId } = await req.json()

  const { error } = await supabaseAdmin
    .from('notifications')
    .update({ is_read: true })
    .eq('notification_id', notificationId)
    .eq('user_id', Number(session.user.id))

  if (error) {
    console.error("Error marking notification as read:", error)
    return Response.json({ error: "Failed to update notification" }, { status: 500 })
  }

  return Response.json({ success: true })
}
