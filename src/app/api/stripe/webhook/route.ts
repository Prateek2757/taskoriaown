import Stripe from "stripe";
import pool from "@/lib/dbConnect";

export const config = { api: { bodyParser: false } };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const raw = await req.text();
  const sig = req.headers.get("stripe-signature") || "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    console.log("✅ Stripe webhook:", event.type);
  } catch (err: any) {
    console.error("❌ Invalid webhook signature:", err?.message ?? err);
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const meta = session.metadata || {};

    console.log("➡️ Processing checkout session:", session.id, meta);

    const existing = await pool.query(
      `SELECT transaction_id FROM payment_transactions WHERE reference_id = $1 LIMIT 1`,
      [session.id]
    );

    if (existing.rows.length > 0) {
      console.log("⭕ Already processed:", session.id);
      return new Response(JSON.stringify({ received: true }), { status: 200 });
    }

    switch (meta.type) {
      case "Credit_Topup":
        await handleCreditTopup(session, meta);
        break;

      case "Pro_Subscription":
        await handleProSubscription(session, meta);
        break;

      default:
        console.log("⚠️ Unknown metadata.type:", meta.type);
    }
  } else {
    console.log("⤴️ Ignored event type:", event.type);
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}

async function handleCreditTopup(session: Stripe.Checkout.Session, meta: any) {
  console.log("💳 Handling credit topup...");

  const professionalId = meta.professionalId;
  const credits = Number(meta.credits);
  const amount = Number(meta.amount);

  if (!professionalId || !credits || !amount) {
    console.warn("⚠️ Invalid credit metadata:", meta);
    return;
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
    console.log("🆕 Wallet created for:", professionalId);
  } else {
    await pool.query(
      `UPDATE credit_wallets 
       SET total_credits = total_credits + $1, last_updated = NOW()
       WHERE professional_id = $2`,
      [credits, professionalId]
    );
    console.log("💰 Wallet updated for:", professionalId);
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

  console.log("✅ Credit topup processed:", session.id);
}

async function handleProSubscription(session: Stripe.Checkout.Session, meta: any) {
  console.log("🟣 Handling Pro subscription...");

  const ref = session.id;
  const professionalId = Number(meta.professionalId || meta.userId);
  const packageId = Number(meta.packageId);
  const amount = Number(meta.amount);

  if (!professionalId || !packageId || !amount) {
    console.warn("⚠️ Invalid subscription metadata:", meta);
    return;
  }

  const pkgRes = await pool.query(
    `SELECT duration_months FROM professional_packages WHERE package_id = $1`,
    [packageId]
  );
  if (!pkgRes.rows.length) {
    throw new Error("Package not found: " + packageId);
  }

  const durationMonths = pkgRes.rows[0].duration_months || 1;

  const txRes = await pool.query(
    `INSERT INTO payment_transactions
      (reference_id, professional_id, transaction_type, amount, credits_used, payment_gateway, status, remarks, created_at)
     VALUES ($1,$2,'subscription',$3,0,'stripe','completed',$4,NOW())
     RETURNING transaction_id`,
    [ref, professionalId, amount, `Checkout: ${session.id}`]
  );

  const txId = txRes.rows[0].transaction_id;

  const activeRes = await pool.query(
    `SELECT subscription_id, end_date FROM professional_subscriptions
     WHERE user_id = $1 AND status = 'active' AND end_date > NOW()
     ORDER BY end_date DESC LIMIT 1`,
    [professionalId]
  );

  if (activeRes.rows.length > 0) {
    const currentEnd = activeRes.rows[0].end_date;

    await pool.query(
      `INSERT INTO professional_subscriptions
         (user_id, package_id, status, start_date, end_date, cancel_at_period_end, payment_transaction_id, created_at)
       VALUES ($1,$2,'active',$3, ($3 + make_interval(months => $4)), false, $5, NOW())`,
      [professionalId, packageId, currentEnd, durationMonths, txId]
    );

    console.log("🔁 Subscription extended for:", professionalId);
  } else {
    await pool.query(
      `INSERT INTO professional_subscriptions
         (user_id, package_id, status, start_date, end_date, cancel_at_period_end, payment_transaction_id, created_at)
       VALUES ($1,$2,'active',NOW(), (NOW() + make_interval(months => $3)), false, $4, NOW())`,
      [professionalId, packageId, durationMonths, txId]
    );

    console.log("✅ New subscription created for:", professionalId);
  }

  await pool.query(
    `UPDATE professional_topups
     SET status = 'completed', payment_transaction_id = $1, updated_at = NOW()
     WHERE transaction_ref = $2`,
    [txId, ref]
  );

  console.log("🎉 Pro subscription processed:", ref);
}
