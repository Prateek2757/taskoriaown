import { supabaseAdmin } from "@/lib/supabase-admin"

type CreateNotificationParams = {
  userId: string
  title: string
  body: string
  channel?: 'inapp' | 'email' | 'push'
  type?: 'post' | 'comment' | 'request' | 'file' | 'system'
  user_name?: string
  user_avatar?: string
  action_buttons?: { label: string, action: string }[]
  attachment?: string
}

export async function createNotification({
  userId,
  title,
  body,
  channel = 'inapp',
  type,
  user_name,
  user_avatar,
  action_buttons,
  attachment,
}: CreateNotificationParams) {
  
  const { data: notification, error } = await supabaseAdmin
    .from('notifications')
    .insert({
      user_id: userId,
      title,
      body,
      channel,
      type,
      user_name,
      user_avatar,
      action_buttons,
      attachment,
      is_read: false,
      created_at: new Date().toISOString(), 
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating notification:', error)
    throw error
  }
  return notification
}