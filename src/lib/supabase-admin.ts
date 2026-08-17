import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let supabaseAdmin: SupabaseClient<any, "public", any> | null = null;
let hasWarnedAboutMissingServiceRole = false;

export function getSupabaseAdmin() {
  // NEXT_PUBLIC_* values are normally replaced during `next build`. Cloud Run
  // supplies them when the container starts, so read them dynamically here.
  const runtimeEnv = process.env as Record<string, string | undefined>;
  const publicPrefix = ["NEXT", "PUBLIC"].join("_");
  const supabaseUrl =
    runtimeEnv[`${publicPrefix}_SUPABASE_URL`] ?? runtimeEnv.SUPABASE_URL;
  // Never expose the service-role key through a NEXT_PUBLIC_* variable.
  const serviceRoleKey = runtimeEnv.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey =
    runtimeEnv[`${publicPrefix}_SUPABASE_ANON_KEY`] ??
    runtimeEnv.SUPABASE_ANON_KEY;
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
