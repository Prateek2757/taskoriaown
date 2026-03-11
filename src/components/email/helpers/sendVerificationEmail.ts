import { resend } from "@/lib/resend";
import { EmailType } from "../type";
import AppEmail from "../MainEmail";

const EMAIL_CONFIG = {
  from: "Taskoria <noreply@taskoria.com>",
  replyTo: "contact@taskoria.com",
};

const subjectMap: Record<EmailType, string> = {
  welcome: "Welcome to Taskoria 🎉",
  "task-posted": "Your task has been posted 🎉",
  "task-posted-no-budget": "⚠️ Task Posted Without Budget",
  "provider-new-task": "🚨 New task available in your category",
  "provider-email-compose": "You received a message from a professional",
  verification: "Verify your email address",
  "password-reset-code": "Reset Your Password",
  "provider-estimate": "💰 You received a new estimate",
};

interface SendEmailProps {
  email: string;
  type: EmailType;
  username?: string;
  verifyCode?: string;
  taskTitle?: string;
  taskLocation?: string;
  price?: string;
  unit?: string;
  messageFromProvider?: string;
  company?: string;
  professional_name?:string;
  professional_company_name?:string;
  professional_phone?:string;
}

export async function sendEmail({
  email,
  type,
  username,
  verifyCode,
  taskTitle,
  taskLocation,
  price,
  unit,
  messageFromProvider,
  company,
  professional_name,
  professional_company_name,
  professional_phone
}: SendEmailProps) {
  if (!email) {
    console.error("Email address is required");
    return { success: false, error: "Email address is required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.error("Invalid email format");
    return { success: false, error: "Invalid email format" };
  }

  const emailProps:SendEmailProps = {
    type,
    email,
    username,
    verifyCode,
    taskTitle,
    taskLocation,
    price,
    unit,
    messageFromProvider,
    company,
    professional_name,
    professional_company_name,
    professional_phone
  };

  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: email,
      subject: subjectMap[type],
      react: AppEmail(emailProps),
      replyTo: EMAIL_CONFIG.replyTo,
      headers: {
        "X-Entity-Ref-ID": `${type}-${Date.now()}`,
      },
      tags: [
        {
          name: "category",
          value: type,
        },
      ],
    });

    if (error) {
      console.error("Resend API Error:", error);
      return { success: false, error };
    }

    return { success: true, id: data?.id };
  } catch (err) {
    console.error("EMAIL ERROR:", err);
    return { success: false, error: err };
  }
}