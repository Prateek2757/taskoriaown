import "server-only";
import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripe() {
  if (stripeClient) {
    return stripeClient;
  }

  const runtimeEnv = globalThis.process?.env;
  const apiKey =
    runtimeEnv?.STRIPE_SECRET_KEY ??
    // Temporary compatibility for the existing Cloud Run variable. Stripe
    // secrets must never be consumed by browser code.
    runtimeEnv?.NEXT_PUBLIC_STRIPE_SECRET_KEY;

  if (!apiKey) {
    throw new Error("STRIPE_SECRET_KEY is missing");
  }

  stripeClient = new Stripe(apiKey);
  return stripeClient;
}
