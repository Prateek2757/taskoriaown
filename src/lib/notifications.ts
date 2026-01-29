import { supabaseAdmin } from "@/lib/supabase-admin"

type CreateNotificationParams = {
  userId: string
  title: string
  body: string
  channel?: 'inapp' | 'email' | 'push'
  type?: 'post' | 'comment' | 'request' | 'file' | 'system'|'message' | 'lead_purchased' | 'lead_response' | 'task_posted'
  user_name?: string
  action_url?: string
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
  action_url,
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
      action_url,
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

