import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripe() {
  if (stripeClient) {
    return stripeClient;
  }

  const apiKey = process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY;

  if (!apiKey) {
    throw new Error("STRIPE_SECRET_KEY is missing");
  }

  stripeClient = new Stripe(apiKey);
  return stripeClient;
}
