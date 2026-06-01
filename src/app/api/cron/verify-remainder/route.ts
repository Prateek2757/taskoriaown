import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/dbConnect";
import { sendEmailQueue } from "@/lib/sendEmailQueue";

export async function GET(req: NextRequest) {
  const { rows: jobs } = await pool.query(
    `
    SELECT
      u.user_id,
      u.email,
      up.display_name,
      COALESCE(vr.send_count, 0) AS send_count,
      vr.id                      AS reminder_id
    FROM users u
    LEFT JOIN user_profiles up
           ON up.user_id = u.user_id
    LEFT JOIN scheduled_emails vr
           ON vr.user_id = u.user_id
          AND vr.type = 'verify-reminder'
    WHERE u.is_email_verified = FALSE
      AND u.is_deleted = FALSE
      AND u.status = 'active'
      AND COALESCE(vr.send_count, 0) < 3
      AND (
        vr.id IS NULL                                        -- never sent before
        OR vr.last_sent_at <= NOW() - INTERVAL '3 days'     -- or 3d+ since last
      )
    ORDER BY u.created_at ASC
    LIMIT 100
    `
  );

  if (jobs.length === 0) {
    return NextResponse.json({ sent: 0, failed: 0, total: 0 });
  }

  const emailJobs = jobs.map((job) => ({
    type: "verify-reminder" as const,
    email: job.email,
    username: job.display_name,
    _userId: job.user_id,
    _jobId: job.reminder_id, 
    _isNew: job.reminder_id === null,
  }));

  const { sent, failed } = await sendEmailQueue(emailJobs, {
    ratePerSec: 2,
    mode: "sequential",
    onSent: async (job) => {
      if (job._isNew) {
        await pool.query(
          `
          INSERT INTO scheduled_emails
            (user_id, type, send_after, last_sent_at, send_count)
          VALUES
            ($1, 'verify-reminder', NOW(), NOW(), 1)
          ON CONFLICT (user_id, type) DO UPDATE
            SET last_sent_at = NOW(),
                send_count   = scheduled_emails.send_count + 1
          `,
          [job._userId]
        );
      } else {
        await pool.query(
          `
          UPDATE scheduled_emails
          SET last_sent_at = NOW(),
              send_count   = send_count + 1
          WHERE id = $1
          `,
          [job._jobId]
        );
      }
    },
  });

  return NextResponse.json({ sent, failed, total: jobs.length });
}
