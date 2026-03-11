import pool from "@/lib/dbConnect";

export type ActivityType = "email_sent" | "estimate_sent" | "response_sent";

interface LogActivityParams {
  task_id: number | string;
  professional_id: string;
  activity_type: ActivityType;
  metadata?: Record<string, unknown>;
}


export async function logActivity({
  task_id,
  professional_id,
  activity_type,
  metadata = {},
}: LogActivityParams): Promise<void> {
  try {
    const client = await pool.connect();
    await client.query(
      `INSERT INTO provider_activities (task_id, professional_id, activity_type, metadata)
       VALUES ($1, $2, $3, $4)`,
      [task_id, professional_id, activity_type, JSON.stringify(metadata)]
    );
    client.release();
  } catch (err) {
    console.error("[logActivity] Failed to log activity:", err);
  }
}