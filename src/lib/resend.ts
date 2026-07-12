import { Resend } from "resend";

let resendClient: Resend | null = null;

export function getResend() {
  if (resendClient) {
    return resendClient;
  }

  const apiKey = process.env.NEXT_PUBLIC_RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is missing");
  }

  resendClient = new Resend(apiKey);
  return resendClient;
}
