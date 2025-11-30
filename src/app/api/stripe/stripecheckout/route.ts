import Stripe from "stripe";
import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface CheckoutRequestBody {
  professionalId: string;
  packageId: string;
  amount: number;
  credits?: number;
  packageName: string;
}

export async function POST(request: Request) {
  try {
    const body: CheckoutRequestBody = await request.json();
    const { professionalId, packageId, amount, credits, packageName } = body;

    if (!professionalId || !packageId || !amount || !packageName) {
      console.warn("Missing required fields:", body);
      return NextResponse.json(
        { error: "Missing required fields", body },
        { status: 400 }
      );
    }

    const amountInCents = Math.round(Number(amount) * 100);
    if (!credits) {
      const activeSub = await pool.query(
        `SELECT subscription_id FROM professional_subscriptions 
     WHERE user_id = $1 AND status = 'active' AND end_date > NOW()
     LIMIT 1`,
        [professionalId]
      );

      if (activeSub.rows.length > 0) {
        return NextResponse.json(
          { error: "You already have an active Taskoria Pro subscription." },
          { status: 400 }
        );
      }
    }

    let successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing/my_credits`;

    if (!credits) {
      successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/provider/dashboard`;
    }
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
        type: credits ? "Credit_Topup" : "Pro_Subscription",
        professionalId,
        packageId,
        credits: String(credits || 0),
        amount: String(amount),
      },
      
      success_url: successUrl,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
    });

    if (credits) {
      await pool.query(
        `INSERT INTO credit_topups
        (professional_id, package_id, amount, credits_added, payment_method, transaction_ref, status)
        VALUES ($1, $2, $3, $4, 'stripe', $5, 'pending')`,
        [professionalId, packageId, amount, credits, session.id]
      );
    } else {
      await pool.query(
        `Insert INTO professional_topups (user_id,package_id, amount,payment_method,transaction_ref,status) 
        VALUES ($1,$2,$3,'stripe',$4,'pending')`,
        [professionalId, packageId, amount, session.id]
      );
    }
    console.log("✅ Stripe checkout session created successfully:", session.id);

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error(
      "❌ Stripe checkout error full:",
      JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
    );

    const errorDetails = {
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...(error.code && { code: error.code }),
      ...(error.raw && { raw: error.raw }),
    };

    return NextResponse.json(
      {
        error: "Checkout failed",
        details: errorDetails,
      },
      { status: 500 }
    );
  }
}
