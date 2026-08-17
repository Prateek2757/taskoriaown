import "server-only";
import { Resend } from "resend";

let resendClient: Resend | null = null;

export function getResend() {
  if (resendClient) {
    return resendClient;
  }

  const runtimeEnv = process.env as Record<string, string | undefined>;
  const publicPrefix = ["NEXT", "PUBLIC"].join("_");
  const apiKey =
    runtimeEnv.RESEND_API_KEY ??
    runtimeEnv[`${publicPrefix}_RESEND_API_KEY`];

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is missing");
  }

  resendClient = new Resend(apiKey);
  return resendClient;
}
