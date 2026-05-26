import { sendEmail } from "@/components/email/helpers/sendVerificationEmail";

export interface EmailJob {
  [key: string]: any;
}

export interface SendEmailQueueOptions {
  ratePerSec?: number;
  mode?: "sequential" | "parallel";
  onSent?: (job: EmailJob) => Promise<void>;
}

export async function sendEmailQueue(
  jobs: EmailJob[],
  options: SendEmailQueueOptions = {}
): Promise<{ sent: number; failed: number }> {
  const { ratePerSec = 1, mode = "sequential", onSent } = options;

  let sent = 0;
  let failed = 0;

  if (mode === "parallel") {
    const results = await Promise.allSettled(
      jobs.map(async (job) => {
        await sendEmail(job as any);
        await onSent?.(job);
      })
    );
    sent = results.filter((r) => r.status === "fulfilled").length;
    failed = results.filter((r) => r.status === "rejected").length;
    return { sent, failed };
  }

  const delay = 2000 / ratePerSec;

  for (let i = 0; i < jobs.length; i++) {
    try {
      await sendEmail(jobs[i] as any);
      await onSent?.(jobs[i]);
      sent++;
    } catch (err) {
      console.error("sendEmailQueue: failed to send email", err);
      failed++;
    }

    if (i < jobs.length - 1) {
      await new Promise((res) => setTimeout(res, delay));
    }
  }

  return { sent, failed };
}