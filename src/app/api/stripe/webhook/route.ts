import Stripe from "stripe";
import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const raw = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      raw,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    if (!session.metadata || !('professionalId' in session.metadata) || !('packageId' in session.metadata) || !('credits' in session.metadata) || !('amount' in session.metadata)) {
      return new Response("Invalid metadata", { status: 400 });
    }
    const { professionalId, packageId, credits, amount } = session.metadata;

    await pool.query(
      `UPDATE credit_topups
       SET status='completed', updated_at=NOW()
       WHERE transaction_ref=$1`,
      [session.id]
    );

    await pool.query(
      `UPDATE credit_wallets 
       SET total_credits = total_credits + $1
       WHERE professional_id = $2`,
      [credits, professionalId]
    );

    await pool.query(
      `INSERT INTO payment_transactions 
      (reference_id, professional_id, transaction_type, amount, credits_used, payment_gateway, status, remarks)
      VALUES ($1, $2, 'credit_purchase', $3, $4, 'stripe', 'completed', $5)`,
      [
        session.id,
        professionalId,
        amount,
        credits,
        `PaymentIntent: ${session.payment_intent}`,
      ]
    );
  }

  return NextResponse.json({ received: true });
}