import { resend } from "@/lib/resend";
import AppEmail, { EmailType } from "../VerificationEmail";

interface SendEmailProps {
  email: string;
  type: EmailType;
  username?: string;
  verifyCode?: string;
  taskTitle?: string;
  category?:string;
  taskLocation?: string;
}

export async function sendEmail({
  email,
  type,
  username,
  verifyCode,
  taskTitle,
  taskLocation,
  
}: SendEmailProps) {
  try {
    if (!email) return;

    const subjectMap: Record<EmailType, string> = {
      welcome: "Welcome to Taskoria 🎉",
      "task-posted": "Your task has been posted 🎉",
      "task-posted-no-budget": "⚠️ Task Posted Without Budget",
      "provider-new-task": "🚨 New task available in your category",
      verification: "Verify your email address",
    };

    await resend.emails.send({
      from: "Taskoria <noreply@taskoria.com>",
      to: email,
      subject: subjectMap[type],
      react: AppEmail({
        type,
        username,
        verifyCode,
        taskTitle,
        taskLocation,
      }),
      replyTo: "support@taskoria.com",
    });
  } catch (err) {
    console.error("EMAIL ERROR:", err);
  }
}