import pkg from "pg";
const { Pool } = pkg;

declare global {
  var pgPool: InstanceType<typeof Pool> | undefined;
}

const pool =
  global.pgPool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
    max: 10,                    // limit connections
    idleTimeoutMillis: 30000,   // close idle after 30s
    connectionTimeoutMillis: 2000,
  });

if (process.env.NODE_ENV !== "production") {
  global.pgPool = pool;
}

export default pool;