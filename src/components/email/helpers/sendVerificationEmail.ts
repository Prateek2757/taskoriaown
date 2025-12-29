import { resend } from "@/lib/resend";
import AppEmail from "../VerificationEmail";

type EmailType = "welcome" | "task-posted" | "verification";

interface SendEmailProps {
  email: string;
  username?: string;
  type: EmailType;
  verifyCode?: string;
  taskTitle?: string;
  taskLocation?: string;
}

export async function sendEmail({
  email,
  username,
  type,
  verifyCode,
  taskTitle,
  taskLocation,
}: SendEmailProps) {
  try {
    if (!email) {
      throw new Error("Email is required");
    }

    const subjectMap: Record<EmailType, string> = {
      welcome: "Welcome to Taskoria 🎉",
      "task-posted": "Your task has been posted",
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
      replyTo:"support@taskoria.com"
    });

    return {
      success: true,
      message: "Email sent successfully",
    };
  } catch (error) {
    console.error("Email send error:", error);
    return {
      success: false,
      message: "Failed to send email",
    };
  }
}