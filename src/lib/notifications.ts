import { getSupabaseAdmin } from "@/lib/supabase-admin";

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
  const supabaseAdmin = getSupabaseAdmin();

  const { data: notification, error } = await supabaseAdmin
    .from("notifications")
    .insert({
      user_id: userId,
      title,
      body,
      channel,
      type,
      user_name,
      action_url,
      role,
      is_read: false,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating notification:", error);
    throw error;
  }

  return notification;
}
