import Stripe from "stripe";
import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

interface CheckoutRequestBody {
  professionalId: string;
  packageId: string;
  amount: number;
  credits: number;
  packageName: string;
}

export async function POST(request: Request) {
  try {
    const body: CheckoutRequestBody = await request.json();
    const { professionalId, packageId, amount, credits, packageName } = body;

    if (!professionalId || !packageId || !amount || !credits || !packageName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const amountInCents = Math.round(amount * 100);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "aud",
            product_data: { name: packageName },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        professionalId,
        packageId,
        credits: String(credits),
        amount: String(amount),
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing/my_credits`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
    });

    await pool.query(
      `INSERT INTO credit_topups
        (professional_id, package_id, amount, credits_added, payment_method, transaction_ref, status)
        VALUES ($1, $2, $3, $4, 'stripe', $5, 'pending')`,
      [professionalId, packageId, amount, credits, session.id]
    );

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: "Checkout failed", detail: error.message }, { status: 500 });
  }
}