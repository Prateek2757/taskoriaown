import "dotenv/config";
import fs from "fs";
import path from "path";
import { Client } from "pg";

const FILE_PATH = path.join(process.cwd(), "data", "AU.txt");
const BATCH_SIZE = 500;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing in .env");
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

function clean(value) {
  const v = value?.trim();
  return v ? v : null;
}

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function isBetterRow(existing, incoming) {
  const existingAccuracy = Number(existing.accuracy || 0);
  const incomingAccuracy = Number(incoming.accuracy || 0);

  if (incomingAccuracy > existingAccuracy) return true;

  // If same accuracy, prefer row with valid coordinates
  if (
    incomingAccuracy === existingAccuracy &&
    incoming.latitude !== null &&
    incoming.longitude !== null &&
    (existing.latitude === null || existing.longitude === null)
  ) {
    return true;
  }

  return false;
}

async function insertBatch(client, rows) {
  const columnsPerRow = 18;
  const values = [];
  const placeholders = [];

  rows.forEach((row, rowIndex) => {
    const offset = rowIndex * columnsPerRow;

    placeholders.push(
      `(${Array.from(
        { length: columnsPerRow },
        (_, i) => `$${offset + i + 1}`
      ).join(", ")})`
    );

    values.push(
      row.countryCode,
      row.postalCode,
      row.placeName,
      row.stateName,
      row.stateCode,
      row.regionName,
      row.regionCode,
      row.communityName,
      row.communityCode,
      row.latitude,
      row.longitude,
      row.accuracy,
      row.placeSlug,
      row.stateSlug,
      row.urlSlug,
      row.displayName,
      "geonames",
      true
    );
  });

  const sql = `
    INSERT INTO public.australia_locations (
      country_code,
      postal_code,
      place_name,
      state_name,
      state_code,
      region_name,
      region_code,
      community_name,
      community_code,
      latitude,
      longitude,
      accuracy,
      place_slug,
      state_slug,
      url_slug,
      display_name,
      source,
      is_active
    )
    VALUES ${placeholders.join(", ")}
    ON CONFLICT (postal_code, place_name, state_code)
    DO UPDATE SET
      state_name = EXCLUDED.state_name,
      region_name = EXCLUDED.region_name,
      region_code = EXCLUDED.region_code,
      community_name = EXCLUDED.community_name,
      community_code = EXCLUDED.community_code,
      latitude = EXCLUDED.latitude,
      longitude = EXCLUDED.longitude,
      accuracy = EXCLUDED.accuracy,
      place_slug = EXCLUDED.place_slug,
      state_slug = EXCLUDED.state_slug,
      url_slug = EXCLUDED.url_slug,
      display_name = EXCLUDED.display_name,
      source = EXCLUDED.source,
      is_active = EXCLUDED.is_active,
      updated_at = NOW()
  `;

  await client.query(sql, values);
}

async function main() {
  if (!fs.existsSync(FILE_PATH)) {
    throw new Error(`AU.txt not found at ${FILE_PATH}`);
  }

  const raw = fs.readFileSync(FILE_PATH, "utf8");
  const lines = raw.split("\n").filter(Boolean);

  console.log(`Found ${lines.length} rows in AU.txt`);

  const rowsMap = new Map();

  for (const line of lines) {
    const cols = line.split("\t");

    const countryCode = clean(cols[0]);
    const postalCode = clean(cols[1]);
    const placeName = clean(cols[2]);
    const stateName = clean(cols[3]);
    const stateCode = clean(cols[4]);
    const regionName = clean(cols[5]);
    const regionCode = clean(cols[6]);
    const communityName = clean(cols[7]);
    const communityCode = clean(cols[8]);
    const latitude = toNumber(cols[9]);
    const longitude = toNumber(cols[10]);
    const accuracy = toNumber(cols[11]);

    if (countryCode !== "AU") continue;
    if (!postalCode || !placeName || !stateCode) continue;

    const placeSlug = slugify(placeName);
    const stateSlug = stateCode.toLowerCase();
    const urlSlug = `${placeSlug}-${stateSlug}`;
    const displayName = `${placeName}, ${stateCode}, Australia`;

    const row = {
      countryCode,
      postalCode,
      placeName,
      stateName,
      stateCode,
      regionName,
      regionCode,
      communityName,
      communityCode,
      latitude,
      longitude,
      accuracy,
      placeSlug,
      stateSlug,
      urlSlug,
      displayName,
    };

    const uniqueKey = `${postalCode}|${placeName}|${stateCode}`;
    const existing = rowsMap.get(uniqueKey);

    if (!existing || isBetterRow(existing, row)) {
      rowsMap.set(uniqueKey, row);
    }
  }

  const rows = Array.from(rowsMap.values());

  console.log(`Prepared ${rows.length} unique rows for import`);

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  await client.connect();

  try {
    let imported = 0;

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, i + BATCH_SIZE);

      await insertBatch(client, batch);

      imported += batch.length;
      console.log(`Imported ${imported}/${rows.length}`);
    }

    console.log("Import completed successfully.");
  } catch (error) {
    console.error("Import failed:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();