import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let supabaseAdmin: SupabaseClient<any, "public", any> | null = null;
let hasWarnedAboutMissingServiceRole = false;

export function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  // Never expose the service-role key through a NEXT_PUBLIC_* variable.
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabaseKey = serviceRoleKey ?? anonKey;

  if (!supabaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!supabaseKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  if (!serviceRoleKey && !hasWarnedAboutMissingServiceRole) {
    console.warn("SUPABASE_SERVICE_ROLE_KEY is missing; using anon key for server Supabase client.");
    hasWarnedAboutMissingServiceRole = true;
  }

  if (supabaseAdmin) {
    return supabaseAdmin;
  }

  supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return supabaseAdmin;
}
