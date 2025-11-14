import Stripe from "stripe";
import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";

export const config = { api: { bodyParser: false } };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

interface SessionMetadata {
  professionalId: string;
  packageId: string;
  credits: string;
  amount: string;
}

export async function POST(req: Request) {
  // console.log("🔥 Stripe webhook RECEIVED");

  const raw = await req.text();
  const signature = req.headers.get("stripe-signature")!;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(raw, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("⚠️ Webhook signature verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    if (!session.metadata) {
      console.warn("⚠️ Checkout session has no metadata. Ignored.");
      return NextResponse.json({ ignored: true });
    }

    const metadata = session.metadata as unknown as SessionMetadata;
    const professionalId = metadata.professionalId;
    const credits = Number(metadata.credits);
    const amount = Number(metadata.amount);

    if (!professionalId || !credits || !amount) {
      console.warn("⚠️ Invalid metadata in session. Ignored.");
      return NextResponse.json({ ignored: true });
    }

    try {
      const { rows } = await pool.query(
        `SELECT status FROM credit_topups WHERE transaction_ref=$1`,
        [session.id]
      );

      if (rows.length && rows[0].status === "completed") {
        console.log("✅ Session already processed. Ignored.");
        return NextResponse.json({ ignored: true });
      }

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
        [session.id, professionalId, amount, credits, `PaymentIntent: ${session.payment_intent}`]
      );

      console.log("✅ Stripe webhook processed successfully!");
    } catch (dbError) {
      console.error("❌ Database update failed:", dbError);
      return new Response("DB update failed", { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}