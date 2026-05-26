import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/dbConnect";
import { sendEmailQueue } from "@/lib/sendEmailQueue";

export async function GET(req: NextRequest) {
  // Uncomment in production:
  // if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return new Response("Unauthorized", { status: 401 });
  // }

  const type = req.nextUrl.searchParams.get("type");
  if (!type || !["nudge", "month"].includes(type)) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  const { rows: jobs } = await pool.query(
    `
    SELECT
      se.id,
      se.send_count,
      u.email,
      up.display_name,
      u.profile_completion,
      c.about AS company_about,
      (SELECT COUNT(*) > 0 FROM user_profile_services WHERE user_id = u.user_id) AS has_services,
      (SELECT COUNT(*) > 0 FROM user_profile_photos   WHERE user_id = u.user_id) AS has_photos,
      (SELECT COUNT(*) > 0 FROM user_social_links     WHERE user_id = u.user_id AND is_visible = true) AS has_social,
      (SELECT COUNT(*) > 0 FROM user_accreditations   WHERE user_id = u.user_id) AS has_accreditations,
      (SELECT COUNT(*) > 0 FROM user_faqs             WHERE user_id = u.user_id AND is_visible = true) AS has_faqs
    FROM scheduled_emails se
    JOIN users u ON u.user_id = se.user_id
    LEFT JOIN user_profiles up ON up.user_id = se.user_id
    LEFT JOIN company c ON c.user_id = se.user_id
    WHERE se.type = $1
      AND se.send_after <= NOW()
      AND u.profile_completion < 100
      AND u.is_deleted = FALSE
      AND u.is_email_verified = true
      AND (
        CASE
          WHEN $1 = 'nudge' THEN se.send_count = 0
          WHEN $1 = 'month' THEN se.last_sent_at IS NULL
          OR se.last_sent_at <= NOW() - INTERVAL '30 days'
        END
      )
    `,
    [type]
  );

  const emailJobs = jobs.map((job) => ({
    type: "complete-profile",
    email: job.email,
    username: job.display_name,
    completionPercent: job.profile_completion,
    profileFlags: {
      hasAboutAndBio:
        job.display_name?.trim().length > 0 &&
        job.company_about?.trim().length >= 30,
      hasServices: job.has_services,
      hasPhotos: job.has_photos,
      hasSocialLinks: job.has_social,
      hasAccreditations: job.has_accreditations,
      hasFaqs: job.has_faqs,
    },
    _jobId: job.id,
  }));

  const { sent, failed } = await sendEmailQueue(emailJobs, {
    ratePerSec: 2,
    mode: "sequential",
    onSent: async (job) => {
      await pool.query(
        `
        UPDATE scheduled_emails
        SET last_sent_at = NOW(),
            send_count   = send_count + 1
        WHERE id = $1
        `,
        [job._jobId]
      );
    },
  });

  return NextResponse.json({ type, sent, failed });
}