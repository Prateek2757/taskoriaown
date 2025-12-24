import { getServerSession } from "next-auth"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { authOptions } from "../auth/[...nextauth]/options"
export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data } = await supabaseAdmin
    .from('notifications')
    .select('*')
    .eq('user_id', Number(session.user.id))
    .order('created_at', { ascending: false })
    .limit(20)

  return Response.json(data)
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }
  
    const { notificationId } = await req.json()
  
    await supabaseAdmin
      .from('notifications')
      .update({ is_read: true })
      .eq('notification_id', notificationId)
      .eq('user_id', Number(session.user.id))
  
    return Response.json({ success: true })
  }