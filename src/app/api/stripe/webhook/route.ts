import Stripe from "stripe";
import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";

//stripe listen --forward-to localhost:3000/api/stripe/webhook
export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
interface SessionMetadata {
  professionalId: string;
  packageId: string;
  credits: string;
  amount: string;
}

export async function POST(req: Request) {
  const raw = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      raw,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    console.log("✅ Stripe webhook received:", event.type);
  } catch (err) {
    console.error("⚠️ Webhook signature verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    console.log("Checkout session completed:", session.id, session.metadata);

    if (!session.metadata) {
      console.warn("⚠️ Missing metadata. Ignoring.");
      return new Response(JSON.stringify({ received: true }), { status: 200 });
    }

    const metadata = session.metadata as unknown as SessionMetadata;

    const professionalId = metadata.professionalId;
    const credits = Number(metadata.credits);
    const amount = Number(metadata.amount);

    if (!professionalId || !credits || !amount) {
      console.warn("⚠️ Invalid metadata. Ignoring.");
      return new Response(JSON.stringify({ received: true }), { status: 200 });
    }

    try {
      const { rows } = await pool.query(
        `SELECT status FROM credit_topups WHERE transaction_ref = $1`,
        [session.id]
      );

      if (rows.length && rows[0].status === "completed") {
        console.log("⭕ Already processed. Skipping.");
        return new Response(JSON.stringify({ received: true }), {
          status: 200,
        });
      }

      const wallet = await pool.query(
        `SELECT total_credits FROM credit_wallets WHERE professional_id = $1`,
        [professionalId]
      );

      if (wallet.rows.length === 0) {
        await pool.query(
          `INSERT INTO credit_wallets (professional_id, total_credits)
           VALUES ($1, $2)`,
          [professionalId, credits]
        );

        console.log("🆕 New credit wallet created:", professionalId);
      } else {
        await pool.query(
          `UPDATE credit_wallets 
           SET total_credits = total_credits + $1
           WHERE professional_id = $2`,
          [credits, professionalId]
        );

        console.log("💰 Wallet updated:", professionalId);
      }

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

      await pool.query(
        `UPDATE credit_topups
         SET status = 'completed', updated_at = NOW()
         WHERE transaction_ref = $1`,
        [session.id]
      );

      console.log("✅ Stripe webhook processed successfully!");
    } catch (dbError) {
      console.error("❌ Database update failed:", dbError);
      return new Response("DB update failed", { status: 500 });
    }
  } else {
    console.log("⚠️ Ignored event type:", event.type);
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
