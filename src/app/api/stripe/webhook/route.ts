import Stripe from "stripe";
import pool from "@/lib/dbConnect";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const raw = await req.text();
  const sig = req.headers.get("stripe-signature") || "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      raw,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("❌ Invalid webhook signature:", err?.message ?? err);
    return new Response("Invalid signature", { status: 400 });
  }

  const data = event.data.object as any;
  console.log(`📥 Webhook: ${event.type} | ID: ${data.id}`);

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(data);
        break;

      case "invoice.paid":
        await handleInvoicePaid(data);
        break;

      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(data);
        break;

      case "customer.subscription.deleted":
        await handleCanceledSubscription(data);
        break;

      default:
        break;
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (error: any) {
    console.error(`❌ Error processing ${event.type}:`, {
      message: error.message,
      stack: error.stack,
      eventId: event.id,
    });
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

function extractSubscriptionId(invoice: any): string | null {
  return (
    invoice.subscription ??
    invoice.parent?.subscription_details?.subscription ??
    invoice.lines?.data?.[0]?.parent?.subscription_item_details?.subscription ??
    null
  );
}


function extractInvoiceMeta(invoice: any): Record<string, string> {
  if (invoice.metadata && Object.keys(invoice.metadata).length > 0) {
    return invoice.metadata;
  }

  const parentMeta = invoice.parent?.subscription_details?.metadata;
  if (parentMeta && Object.keys(parentMeta).length > 0) {
    return parentMeta;
  }

  const lineItemMeta = invoice.lines?.data?.[0]?.metadata;
  if (lineItemMeta && Object.keys(lineItemMeta).length > 0) {
    return lineItemMeta;
  }

  return {};
}


async function handleCheckoutCompleted(session: any) {
  console.log("🎯 checkout.session.completed:", session.id);

  if (session.mode === "payment") {
    await handleCreditTopup(session);
  } else if (session.mode === "subscription") {
    const subscriptionType = await getSubscriptionType(session);
    if (subscriptionType === "pro_subscription") {
      await handleProSubscription(session);
    } else {
      console.warn("⚠️ Unknown subscription type, defaulting to pro");
      await handleProSubscription(session);
    }
  }
}

async function getSubscriptionType(session: any): Promise<string> {
  if (session.metadata?.type) return session.metadata.type;

  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id;

  if (subscriptionId) {
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      if (subscription.metadata?.type) return subscription.metadata.type;
    } catch (error) {
      console.error("❌ Failed to retrieve subscription:", error);
    }
  }

  return "pro_subscription";
}

async function handleInvoicePaid(invoice: any) {
  console.log("💰 invoice.paid:", invoice.id, "| reason:", invoice.billing_reason);

  let subscriptionId = extractSubscriptionId(invoice);

  if (!subscriptionId && invoice.billing_reason === "subscription_create" && invoice.customer) {
    console.log("🔍 Falling back to customer subscription lookup:", invoice.customer);
    try {
      const subscriptions = await stripe.subscriptions.list({
        customer: invoice.customer,
        status: "all",
        limit: 5,
      });

      if (subscriptions.data.length > 0) {
        const now = Math.floor(Date.now() / 1000);
        const recent = subscriptions.data.find((s) => now - s.created < 60);
        subscriptionId = (recent ?? subscriptions.data[0]).id;
        console.log("✅ Resolved subscription via customer lookup:", subscriptionId);
      }
    } catch (error) {
      console.error("❌ Customer subscription lookup failed:", error);
    }
  }

  if (!subscriptionId) {
    console.warn("⚠️ Could not resolve subscription ID — skipping invoice:", invoice.id);
    return;
  }

  if (invoice.billing_reason === "subscription_create") {
    console.log("ℹ️ subscription_create already handled by checkout.session.completed — skipping.");
    return;
  }

  if (invoice.billing_reason !== "subscription_cycle") {
    console.log(`ℹ️ Unhandled billing_reason '${invoice.billing_reason}' — skipping.`);
    return;
  }

  let subscription: Stripe.Subscription;
  try {
    subscription = await stripe.subscriptions.retrieve(subscriptionId);
  } catch (error) {
    console.error("❌ Could not retrieve subscription:", subscriptionId, error);
    throw error;
  }

  const meta = extractInvoiceMeta(invoice);
  console.log("📋 Resolved metadata:", meta);

  const subscriptionType = subscription.metadata?.type ?? meta?.type ?? "pro_subscription";

  if (subscriptionType !== "pro_subscription") {
    console.log(`ℹ️ Not a pro_subscription (${subscriptionType}) — skipping recurring handler.`);
    return;
  }

  await handleRecurringPayment(invoice, subscription, meta);
  console.log(subscription,"subidddddd");
  
}

async function handleCreditTopup(session: any) {
  const meta = session.metadata;
  const professionalId = Number(meta.professionalId);
  const credits = Number(meta.credits);
  const amount = Number(meta.amount);

  if (!professionalId || !credits || !amount) {
    console.warn("⚠️ Missing credit topup data:", meta);
    return;
  }

  const wallet = await pool.query(
    `SELECT total_credits FROM credit_wallets WHERE professional_id=$1`,
    [professionalId]
  );

  if (wallet.rows.length === 0) {
    await pool.query(
      `INSERT INTO credit_wallets (professional_id, total_credits) VALUES ($1,$2)`,
      [professionalId, credits]
    );
    console.log(`✅ Created new wallet with ${credits} credits`);
  } else {
    await pool.query(
      `UPDATE credit_wallets SET total_credits=total_credits+$1, last_updated=NOW() WHERE professional_id=$2`,
      [credits, professionalId]
    );
    console.log(`✅ Added ${credits} credits to wallet`);
  }

  await pool.query(
    `UPDATE credit_topups SET status='completed', updated_at=NOW() WHERE transaction_ref=$1`,
    [session.id]
  );

  console.log("✅ One-time credit purchase completed");
}

async function handleProSubscription(session: any) {
  const meta = session.metadata;
  const professionalId = Number(meta.professionalId);
  const packageId = Number(meta.packageId);
  const amount = Number(meta.amount);

  const pkgCheck = await pool.query(
    `SELECT package_id, stripe_price_id, duration_months FROM professional_packages WHERE package_id=$1`,
    [packageId]
  );

  if (pkgCheck.rows.length === 0) {
    throw new Error(`Package ID ${packageId} does not exist in professional_packages`);
  }

  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id;

  if (!subscriptionId) throw new Error("Missing subscription ID from session");

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const trialStart = subscription.trial_start
    ? new Date(subscription.trial_start * 1000)
    : new Date(subscription.start_date * 1000);

  const trialEnd = subscription.trial_end
    ? new Date(subscription.trial_end * 1000)
    : null;

  const billingAnchor = new Date(subscription.billing_cycle_anchor * 1000);

  const txRes = await pool.query(
    `INSERT INTO payment_transactions
      (reference_id, professional_id, transaction_type, amount, credits_used, payment_gateway, status, remarks, created_at)
     VALUES ($1,$2,'subscription',$3,0,'stripe','completed',$4,NOW())
     RETURNING transaction_id`,
    [subscriptionId, professionalId, amount, `Checkout: ${session.id}`]
  );
  const txId = txRes.rows[0].transaction_id;

  await pool.query(
    `INSERT INTO professional_subscriptions
      (user_id, package_id, status, start_date, end_date, trail_end_date, payment_transaction_id, subscription_id)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     ON CONFLICT (subscription_id) DO NOTHING`,
    [professionalId, packageId, subscription.status, trialStart, billingAnchor, trialEnd, txId, subscriptionId]
  );

  await pool.query(
    `UPDATE professional_topups SET status='completed', updated_at=NOW() WHERE transaction_ref=$1`,
    [session.id]
  );

  console.log("✅ Pro subscription created for professional:", professionalId);
}


async function handleRecurringPayment(
  invoice: any,
  subscription: Stripe.Subscription,
  meta: Record<string, string>
) {
  const subscriptionId = subscription.id;

  console.log("🔄 Recurring payment:", subscriptionId, "| invoice:", invoice.id);


  let professionalId = Number(meta?.professionalId) || null;
  let packageId = Number(meta?.packageId) || null;

  const subRes = await pool.query(
    `SELECT user_id, package_id, end_date
     FROM professional_subscriptions
     WHERE subscription_id=$1
     ORDER BY end_date DESC
     LIMIT 1`,
    [subscriptionId]
  );

  if (!subRes.rows.length) {
    console.warn("⚠️ No existing subscription row found for:", subscriptionId);
    return;
  }

  const existingRow = subRes.rows[0];
  if (!professionalId) professionalId = existingRow.user_id;
  if (!packageId) packageId = existingRow.package_id;

  const pkgRes = await pool.query(
    `SELECT duration_months FROM professional_packages WHERE package_id=$1`,
    [packageId]
  );

  if (pkgRes.rows.length === 0) {
    throw new Error(`Package ${packageId} no longer exists. Cannot renew subscription.`);
  }

  const durationMonths: number = pkgRes.rows[0].duration_months || 1;


  const lineItemPeriod = invoice.lines?.data?.[0]?.period;
  const newStartDate = lineItemPeriod?.start
    ? new Date(lineItemPeriod.start * 1000)
    : existingRow.end_date;

  const newEndDate = lineItemPeriod?.end
    ? new Date(lineItemPeriod.end * 1000)
    : (() => {
        const d = new Date(newStartDate);
        d.setMonth(d.getMonth() + durationMonths);
        return d;
      })();

  const amountPaid = invoice.amount_paid / 100; 

  const txRes = await pool.query(
    `INSERT INTO payment_transactions
      (reference_id, professional_id, transaction_type, amount, credits_used, payment_gateway, status, remarks, created_at)
     VALUES ($1,$2,'subscription',$3,0,'stripe','completed',$4,NOW())
     RETURNING transaction_id`,
    [invoice.id, professionalId, amountPaid, `Recurring: ${subscriptionId}`]
  );
  const txId = txRes.rows[0].transaction_id;

  await pool.query(
    `INSERT INTO professional_subscriptions
      (user_id, package_id, status, start_date, end_date, subscription_id, payment_transaction_id)
     VALUES ($1,$2,'active',$3,$4,$5,$6)
     ON CONFLICT DO NOTHING`,
    [professionalId, packageId, newStartDate, newEndDate, subscriptionId, txId]
  );

  await pool.query(
    `UPDATE professional_subscriptions
     SET start_date = $1,
         end_date = $2,
         status = 'active',
         payment_transaction_id = $3
     WHERE subscription_id = $4`,
    [newStartDate, newEndDate, txId, subscriptionId]
  );

  console.log(
    `✅ Renewed subscription for professional ${professionalId} | ${newStartDate.toISOString()} → ${newEndDate.toISOString()}`
  );
}

async function handleInvoicePaymentFailed(invoice: any) {
  const subscriptionId = extractSubscriptionId(invoice);
  if (!subscriptionId) {
    console.log("ℹ️ Payment failed for non-subscription invoice");
    return;
  }

  await pool.query(
    `UPDATE professional_subscriptions SET status='past_due' WHERE subscription_id=$1`,
    [subscriptionId]
  );
  console.warn(`⚠️ Subscription ${subscriptionId} marked as past_due`);
}

async function handleCanceledSubscription(subscription: any) {
  await pool.query(
    `UPDATE professional_subscriptions SET status='canceled' WHERE subscription_id=$1`,
    [subscription.id]
  );
  console.log(`✅ Subscription ${subscription.id} marked as canceled`);
}