import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET() {
  // Build the public variable names dynamically. Next.js replaces statically
  // recognizable NEXT_PUBLIC_* lookups during `next build`, while Cloud Run
  // supplies these values only when the container starts.
  const runtimeEnv = process.env as Record<string, string | undefined>;
  const publicPrefix = ["NEXT", "PUBLIC"].join("_");
  const config = JSON.stringify({
    supabaseUrl:
      runtimeEnv[`${publicPrefix}_SUPABASE_URL`] ?? runtimeEnv.SUPABASE_URL ?? "",
    supabaseAnonKey:
      runtimeEnv[`${publicPrefix}_SUPABASE_ANON_KEY`] ??
      runtimeEnv.SUPABASE_ANON_KEY ??
      "",
  }).replace(/</g, "\\u003c");

  return new NextResponse(`window.__TASKORIA_CONFIG__=${config};`, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
