import "dotenv/config";
import { Client } from "pg";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing in .env");
}

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

await client.connect();

try {
  await client.query("CREATE EXTENSION IF NOT EXISTS pg_trgm");

  for (const sql of [
    `CREATE INDEX IF NOT EXISTS australia_locations_place_name_trgm_idx
     ON public.australia_locations USING gin (place_name gin_trgm_ops)
     WHERE is_active = true`,
    `CREATE INDEX IF NOT EXISTS australia_locations_display_name_trgm_idx
     ON public.australia_locations USING gin (display_name gin_trgm_ops)
     WHERE is_active = true`,
    `CREATE INDEX IF NOT EXISTS australia_locations_state_name_trgm_idx
     ON public.australia_locations USING gin (state_name gin_trgm_ops)
     WHERE is_active = true`,
    `CREATE INDEX IF NOT EXISTS australia_locations_state_code_trgm_idx
     ON public.australia_locations USING gin (state_code gin_trgm_ops)
     WHERE is_active = true`,
    `CREATE INDEX IF NOT EXISTS australia_locations_postal_code_idx
     ON public.australia_locations (postal_code text_pattern_ops)
     WHERE is_active = true`,
    `CREATE INDEX IF NOT EXISTS australia_locations_seo_route_idx
     ON public.australia_locations (
       state_slug, place_slug, accuracy DESC NULLS LAST, updated_at DESC
     )
     WHERE is_active = true
       AND place_slug IS NOT NULL
       AND state_slug IS NOT NULL`,
  ]) {
    await client.query(sql);
  }

  console.log("Australia location indexes are ready.");
} finally {
  await client.end();
}
