import { resend } from "@/lib/resend";
import AppEmail, { EmailType } from "../VerificationEmail";
import { toast } from "sonner";

interface SendEmailProps {
  email: string;
  type: EmailType;
  username?: string;
  verifyCode?: string;
  taskTitle?: string;
  category?: string;
  taskLocation?: string;
}

const EMAIL_CONFIG = {
  from: "Taskoria <noreply@taskoria.com>",
  replyTo: "support@taskoria.com",
};

const subjectMap: Record<EmailType, string> = {
  welcome: "Welcome to Taskoria 🎉",
  "task-posted": "Your task has been posted 🎉",
  "task-posted-no-budget": "⚠️ Task Posted Without Budget",
  "provider-new-task": "🚨 New task available in your category",
  verification: "Verify your email address",
  "password-reset-code": "Reset Your Password",
};

export async function sendEmail({
  email,
  type,
  username,
  verifyCode,
  taskTitle,
  taskLocation,
}: SendEmailProps) {
  try {
    if (!email) {
      throw new Error("Email address is required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      // throw new Error("Invalid email format");
      toast.error("Invalid Email Format ")
    }

    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: email,
      subject: subjectMap[type],
      react: AppEmail({
        type,
        username,
        verifyCode,
        taskTitle,
        taskLocation,
      }),
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
      throw error;
    }

    // console.log("Email sent successfully:", data?.id);
    return { success: true, id: data?.id };
  } catch (err) {
    console.error("EMAIL ERROR:", err);
    return { success: false, error: err };
  }
}
// ```

// ## Step 3: Verify DNS Setup in Resend

// 1. Go to Resend Dashboard → Domains
// 2. Click on `taskoria.com`
// 3. Verify all DNS records show green checkmarks
// 4. Wait 24-48 hours for full DNS propagation

// ## Step 4: Additional Best Practices

// ### Enable BIMI (Optional - for verified logos in inbox)
// ```
// Type: TXT
// Name: default._bimi
// Value: v=BIMI1; l=https://taskoria.com/logo.svg; a=