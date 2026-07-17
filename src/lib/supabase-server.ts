import { createClient, type SupabaseClient } from "@supabase/supabase-js";

declare global {
  interface Window {
    __TASKORIA_CONFIG__?: {
      supabaseUrl?: string;
      supabaseAnonKey?: string;
    };
  }
}

let browserClient: SupabaseClient | null = null;

function getSupabaseBrowserClient(): SupabaseClient {
  if (browserClient) return browserClient;

  const runtimeConfig =
    typeof window === "undefined" ? undefined : window.__TASKORIA_CONFIG__;
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || runtimeConfig?.supabaseUrl;
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || runtimeConfig?.supabaseAnonKey;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase browser configuration. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in the Cloud Run runtime environment.",
    );
  }
  
  browserClient = createClient(supabaseUrl, supabaseAnonKey);
  return browserClient;
}

// Client components are also imported while Next.js prerenders server output.
// Defer Supabase initialization until a component actually uses the client.
export const supabaseBrowser = new Proxy({} as SupabaseClient, {
  get(_target, property) {
    const client = getSupabaseBrowserClient();
    const value = Reflect.get(client, property, client);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
