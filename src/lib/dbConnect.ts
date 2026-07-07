import pkg from "pg";
const { Pool } = pkg;

declare global {
  var pgPool: InstanceType<typeof Pool> | undefined;
}

const configuredPoolMax = Number(process.env.PG_POOL_MAX);
const isProductionBuild = process.env.NEXT_PHASE === "phase-production-build";
const poolMax = Number.isFinite(configuredPoolMax) && configuredPoolMax > 0
  ? configuredPoolMax
  : isProductionBuild
    ? 1
    : process.env.NODE_ENV === "production"
      ? 3
      : 10;

const pool =
  global.pgPool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
    max: poolMax,
    idleTimeoutMillis: 30000,   
    connectionTimeoutMillis: 10000,
  });

if (process.env.NODE_ENV !== "production") {
  global.pgPool = pool;
}

export default pool;
