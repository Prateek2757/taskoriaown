import { supabaseAdmin } from "@/lib/supabase-admin"

type CreateNotificationParams = {
  userId: number
  title: string
  body: string
  channel?: 'inapp' | 'email' | 'push'
}

export async function createNotification({
  userId,
  title,
  body,
  channel = 'inapp',
}: CreateNotificationParams) {
  await supabaseAdmin.from('notifications').insert({
    user_id: userId,
    title,
    body,
    channel,
  })
}