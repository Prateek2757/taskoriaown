import { NextResponse } from "next/server";
import { z } from "zod";
import pool from "@/lib/dbConnect";
import { createNotification } from "@/lib/notifications";
import { sendEmail } from "@/components/email/helpers/sendVerificationEmail";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(180),
  subject: z.string().trim().min(1).max(80),
  message: z.string().trim().min(10).max(5000),
});

const subjectLabels: Record<string, string> = {
  general: "General Inquiry",
  technical: "Technical Support",
  billing: "Billing & Payments",
  account: "Account Issues",
  services: "Service Questions",
  feedback: "Feedback & Suggestions",
  other: "Other",
};

// function getAdminRecipients(adminRows: { email: string | null }[]) {
//   const configured = (process.env.ADMIN_EMAIL || "contact@taskoria.com")
//     .split(",")
//     .map((email) => email.trim())
//     .filter(Boolean);

//   const dbEmails = adminRows
//     .map((row) => row.email?.trim())
//     .filter((email): email is string => Boolean(email));

//   return Array.from(new Set([...configured, ...dbEmails]));
// }

export async function POST(req: Request) {
  const client = await pool.connect();

  try {
    const parsed = contactSchema.safeParse(await req.json());

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Please check the form and try again." },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = parsed.data;
    const subjectLabel = subjectLabels[subject] ?? subject;

    const result = await client.query(
      `
      INSERT INTO contact_submissions (name, email, subject, message)
      VALUES ($1, $2, $3, $4)
      RETURNING contact_submission_id, name, email, subject, message, status, created_at
      `,
      [name, email, subject, message]
    );

    const submission = result.rows[0];

    const adminRes = await client.query<{
      user_id: number;
      email: string | null;
    }>(`SELECT user_id, email FROM users WHERE role = 'admin'`);

    // const adminRecipients = getAdminRecipients(adminRes.rows);
    const AdminEmail=process.env.ADMIN_EMAIL || "contact@taskoria.com"
    const sideEffects: Promise<unknown>[] = [];

    // adminRecipients.forEach((adminEmail) => {
      sideEffects.push(
        sendEmail({
          email:AdminEmail,
          type: "contact-submission-admin",
          replyTo: email,
          contactName: name,
          contactEmail: email,
          contactSubject: subjectLabel,
          contactMessage: message,
          // contactSubmissionId: submission.contact_submission_id,
          contactAdminUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://www.taskoria.com"}/admin/contact-submissions`,
        })
      );
    // });

    adminRes.rows.forEach((admin) => {
      sideEffects.push(
        createNotification({
          userId: String(admin.user_id),
          type: "contact_submission",
          title: "New contact support message",
          body: `${name} sent a ${subjectLabel} message.`,
          user_name: name,
          action_url: "/admin/contact-submissions",
        })
      );
    });

    const results = await Promise.allSettled(sideEffects);//promise automatically converts to it format
    results.forEach((result) => {
      if (result.status === "rejected") {
        console.error("Contact submission side effect failed:", result.reason);
      }
    });

    return NextResponse.json({ success: true, submission });
  } catch (error) {
    console.error("[POST /api/contact]", error);
    return NextResponse.json(
      { success: false, message: "Unable to send your message right now." },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
