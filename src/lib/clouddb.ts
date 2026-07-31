import {
  Pool,
  type PoolClient,
  type PoolConfig,
  type QueryResult,
  type QueryResultRow,
} from "pg";

const instanceConnectionName = process.env.INSTANCE_CONNECTION_NAME;

const poolConfig: PoolConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: Number(process.env.DB_POOL_MAX ?? 5),
  connectionTimeoutMillis: Number(
    process.env.DB_CONNECTION_TIMEOUT ?? 10_000,
  ),
  idleTimeoutMillis: Number(process.env.DB_IDLE_TIMEOUT ?? 30_000),
};

// Cloud Run connects through the mounted Cloud SQL Unix socket.
// Local development connects through Cloud SQL Auth Proxy over TCP.
if (instanceConnectionName) {
  poolConfig.host = `/cloudsql/${instanceConnectionName}`;
} else {
  poolConfig.host = process.env.DB_HOST ?? "127.0.0.1";
  poolConfig.port = Number(process.env.DB_PORT ?? 5433);
}

const globalForDatabase = globalThis as unknown as {
  taskoriaPool?: Pool;
};

export const pool =
  globalForDatabase.taskoriaPool ?? new Pool(poolConfig);

if (process.env.NODE_ENV !== "production") {
  globalForDatabase.taskoriaPool = pool;
}

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error:", error);
});

export async function query<T extends QueryResultRow>(
  text: string,
  values: unknown[] = [],
): Promise<QueryResult<T>> {
  return pool.query<T>(text, values);
}

export async function withTransaction<T>(
  callback: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await callback(client);

    await client.query("COMMIT");

    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}