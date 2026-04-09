import pool from "@/lib/dbConnect";

export async function blacklistToken(token: string, expiresAt: Date): Promise<void> {
  await pool.query(
    `INSERT INTO token_blacklist (token_hash, expires_at)
     VALUES (encode(digest($1, 'sha256'), 'hex'), $2)
     ON CONFLICT (token_hash) DO NOTHING`,
    [token, expiresAt]
  );
}

export async function isTokenBlacklisted(token: string): Promise<boolean> {
  const result = await pool.query(
    `SELECT 1 FROM token_blacklist
     WHERE token_hash = encode(digest($1, 'sha256'), 'hex')
       AND expires_at > NOW()`,
    [token]
  );
  return result.rows.length > 0;
}

export async function purgeExpiredTokens(): Promise<void> {
  await pool.query(`DELETE FROM token_blacklist WHERE expires_at <= NOW()`);
}