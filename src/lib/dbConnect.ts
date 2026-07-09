import pkg from "pg";
const { Pool } = pkg;

declare global {
  var pgPool: InstanceType<typeof Pool> | undefined;
  var pgPoolMax: number | undefined;
}

const configuredPoolMax = Number(process.env.PG_POOL_MAX);
const configuredIdleTimeout = Number(process.env.PG_IDLE_TIMEOUT_MS);
const configuredConnectionTimeout = Number(process.env.PG_CONNECTION_TIMEOUT_MS);
const isProductionBuild = process.env.NEXT_PHASE === "phase-production-build";
const poolMax = Number.isFinite(configuredPoolMax) && configuredPoolMax > 0
  ? configuredPoolMax
  : process.env.NODE_ENV === "production" || isProductionBuild
    ? 1
    : 2;
const idleTimeoutMillis =
  Number.isFinite(configuredIdleTimeout) && configuredIdleTimeout > 0
    ? configuredIdleTimeout
    : 5000;
const connectionTimeoutMillis =
  Number.isFinite(configuredConnectionTimeout) && configuredConnectionTimeout > 0
    ? configuredConnectionTimeout
    : 10000;

if (
  process.env.NODE_ENV !== "production" &&
  global.pgPool &&
  global.pgPoolMax !== poolMax
) {
  global.pgPool.end().catch(() => {});
  global.pgPool = undefined;
}

const pool =
  global.pgPool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
    max: poolMax,
    idleTimeoutMillis,
    connectionTimeoutMillis,
  });

if (process.env.NODE_ENV !== "production") {
  global.pgPool = pool;
  global.pgPoolMax = poolMax;
}

export default pool;
