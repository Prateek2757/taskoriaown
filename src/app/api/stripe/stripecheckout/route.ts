import Stripe from "stripe";
import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";

// Very important for Stripe webhooks and raw body

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


    // Validation
    if (!professionalId || !packageId || !amount || !credits || !packageName) {
      console.warn("Missing required fields:", body);
      return NextResponse.json(
        { error: "Missing required fields", body },
        { status: 400 }
      );
    }

    const amountInCents = Math.round(Number(amount) * 100);

    // Create Stripe checkout session
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

    // Save pending topup in DB
    await pool.query(
      `INSERT INTO credit_topups
        (professional_id, package_id, amount, credits_added, payment_method, transaction_ref, status)
        VALUES ($1, $2, $3, $4, 'stripe', $5, 'pending')`,
      [professionalId, packageId, amount, credits, session.id]
    );

    console.log("✅ Stripe checkout session created successfully:", session.id);

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    // Full detailed logging
    console.error("❌ Stripe checkout error full:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));

    // Optional: extract key Stripe error fields
    const errorDetails = {
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...(error.code && { code: error.code }),
      ...(error.raw && { raw: error.raw }),
    };

    // Return details for development (remove raw info in production)
    return NextResponse.json(
      {
        error: "Checkout failed",
        details: errorDetails,
      },
      { status: 500 }
    );
  }
}