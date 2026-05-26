import { resend } from "@/lib/resend";
import { CompleteProfileEmailProps, EmailType } from "../type";
import AppEmail from "../MainEmail";
import { CompleteProfileEmail } from "../templates/ProfileCompletion/ProfileCompletion";

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
  "complete-profile": "Your Taskoria profile is incomplete 👤", // ← new
};

// ── Standard email props (existing types) ─────────────────
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
  professional_name?: string;
  professional_company_name?: string;
  professional_phone?: string;
}

// ── Profile-completion email props (new) ──────────────────
interface SendProfileReminderProps
  extends Pick<CompleteProfileEmailProps, "completionPercent" | "profileFlags"> {
  email: string;
  username?: string;
  company?: string;
  profileUrl?: string;
}

export async function sendEmail(props: SendEmailProps): Promise<{ success: boolean; id?: string; error?: unknown }>;
export async function sendEmail(props: SendProfileReminderProps & { type: "complete-profile" }): Promise<{ success: boolean; id?: string; error?: unknown }>;

export async function sendEmail(
  props: (SendEmailProps | (SendProfileReminderProps & { type: "complete-profile" }))
) {
  const { email } = props;

  if (!email) {
    console.error("Email address is required");
    return { success: false, error: "Email address is required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.error("Invalid email format");
    return { success: false, error: "Invalid email format" };
  }

  let reactTemplate: React.ReactElement;

  if (props.type === "complete-profile") {
    const { username, company, completionPercent, profileFlags, profileUrl } =
      props as SendProfileReminderProps & { type: "complete-profile" };

    reactTemplate = CompleteProfileEmail({
      username,
      company,
      completionPercent,
      profileFlags,
      profileUrl,
    });
  } else {
    reactTemplate = AppEmail(props as SendEmailProps);
  }

  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: email,
      subject: subjectMap[props.type],
      react: reactTemplate,
      replyTo: EMAIL_CONFIG.replyTo,
      headers: {
        "X-Entity-Ref-ID": `${props.type}-${Date.now()}`,
      },
      tags: [
        {
          name: "category",
          value: props.type,
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