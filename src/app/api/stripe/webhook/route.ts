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
  // console.log(`📥 Webhook: ${event.type} | ID: ${data.id}`);

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
        // console.log(`ℹ️ Unhandled event type: ${event.type}`);
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


async function handleCheckoutCompleted(session: any) {
  // console.log("🎯 Processing checkout.session.completed:", session.id);
  
  if (session.mode === "payment") {
    // ONE-TIME PAYMENT (Credits)
    await handleCreditTopup(session);
  } else if (session.mode === "subscription") {
    // RECURRING SUBSCRIPTION (Pro only)
    const subscriptionType = await getSubscriptionType(session);
    
    // console.log("📋 Subscription type detected:", subscriptionType);

    if (subscriptionType === "pro_subscription") {
      await handleProSubscription(session);
    } else {
      console.warn("⚠️ Unknown subscription type, defaulting to pro subscription");
      await handleProSubscription(session);
    }
  }
}


async function getSubscriptionType(session: any): Promise<string | null> {
  if (session.metadata?.type) {
    // console.log("✅ Type found in session.metadata:", session.metadata.type);
    return session.metadata.type;
  }

  const subscriptionId = typeof session.subscription === "string" 
    ? session.subscription 
    : session.subscription?.id;

  if (subscriptionId) {
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      if (subscription.metadata?.type) {
        // console.log("✅ Type found in subscription.metadata:", subscription.metadata.type);
        return subscription.metadata.type;
      }
    } catch (error) {
      console.error("❌ Failed to retrieve subscription:", error);
    }
  }

  // console.log("⚠️ Could not determine subscription type, defaulting to pro_subscription");
  return "pro_subscription";
}

async function handleInvoicePaid(invoice: any) {
  // console.log("💰 Invoice paid event:", {
  //   invoiceId: invoice.id,
  //   subscription: invoice.subscription,
  //   customer: invoice.customer,
  //   billingReason: invoice.billing_reason,
  //   amountPaid: invoice.amount_paid / 100,
  // });

  let subscriptionId = invoice.subscription;

  if (!subscriptionId && invoice.billing_reason === "subscription_create" && invoice.customer) {
    // console.log("🔍 No subscription field but billing_reason is subscription_create");
    // console.log("🔍 Looking up recent subscription for customer:", invoice.customer);
    
    try {
      const subscriptions = await stripe.subscriptions.list({
        customer: invoice.customer,
        status: 'all',
        limit: 5,
      });
      
      if (subscriptions.data.length > 0) {
        const now = Math.floor(Date.now() / 1000);
        const recentSub = subscriptions.data.find(sub => (now - sub.created) < 60);
        
        if (recentSub) {
          subscriptionId = recentSub.id;
          // console.log("✅ Found recent subscription:", subscriptionId);
        } else {
          subscriptionId = subscriptions.data[0].id;
          // console.log("✅ Using most recent subscription:", subscriptionId);
        }
      }
    } catch (error) {
      console.error("❌ Failed to look up subscription by customer:", error);
    }
  }

  if (!subscriptionId) {
    // console.log("⚠️ Could not find subscription ID - skipping invoice");
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const subscriptionType = subscription.metadata?.type;

  if (invoice.billing_reason === "subscription_create") {
    // console.log("💳 Processing FIRST payment for subscription_create");
    // console.log(`📋 Subscription type: ${subscriptionType}`);
    
    // Only pro subscriptions are recurring now
    if (subscriptionType === "pro_subscription" || !subscriptionType) {
      // console.log("ℹ️ Pro subscription - already handled by checkout.session.completed");
      return;
    }
  } else {
    // RECURRING PAYMENT - only for pro subscriptions
    // console.log(`🔄 Processing RECURRING payment for ${subscriptionType || 'pro'} subscription`);
    await handleRecurringPayment(invoice, subscription);
  }
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

  // console.log(`💰 Processing ONE-TIME credit purchase: ${credits} credits for professional ${professionalId}`);

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
    console.log(`✅ Updated wallet, added ${credits} credits`);
  }

  await pool.query(
    `UPDATE credit_topups SET status='completed', updated_at=NOW() WHERE transaction_ref=$1`,
    [session.id]
  );

  console.log(`✅ One-time credit purchase completed`);
}


async function handleProSubscription(session: any) {
  try {
    const meta = session.metadata;
    const professionalId = Number(meta.professionalId);
    const packageId = Number(meta.packageId);
    const amount = Number(meta.amount);

    // console.log("💼 Processing PRO subscription:", {
    //   professionalId,
    //   packageId,
    //   amount,
    //   sessionId: session.id
    // });

    const pkgCheck = await pool.query(
      `SELECT package_id, stripe_price_id, duration_months 
       FROM professional_packages 
       WHERE package_id = $1`,
      [packageId]
    );

    if (pkgCheck.rows.length === 0) {
      throw new Error(
        `❌ Package ID ${packageId} does not exist in professional_packages table`
      );
    }

    // console.log("✅ Package validated:", pkgCheck.rows[0].package_name);

    const subscriptionId =
      typeof session.subscription === "string"
        ? session.subscription
        : session.subscription?.id;

    if (!subscriptionId) {
      throw new Error("Missing subscription ID from session");
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    const trialStart = subscription.trial_start
      ? new Date(subscription.trial_start * 1000)
      : new Date(subscription.start_date * 1000);

    const trialEnd = subscription.trial_end
      ? new Date(subscription.trial_end * 1000)
      : null;

    const billingAnchor = new Date(subscription.billing_cycle_anchor * 1000);
    const endDate = new Date(billingAnchor);

    const txRes = await pool.query(
      `INSERT INTO payment_transactions
            (reference_id, professional_id, transaction_type, amount, credits_used, payment_gateway, status, remarks, created_at)
           VALUES ($1,$2,'subscription',$3,0,'stripe','completed',$4,NOW())
           RETURNING transaction_id`,
      [subscriptionId, professionalId, amount, `Checkout: ${session.id}`]
    );
    const txId = txRes.rows[0].transaction_id;

    // console.log("✅ Payment transaction created:", txId);

    await pool.query(
      `INSERT INTO professional_subscriptions
        (user_id, package_id, status, start_date, end_date, trail_end_date, payment_transaction_id, subscription_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       ON CONFLICT (subscription_id) DO NOTHING`,
      [
        professionalId,
        packageId,
        subscription.status,
        trialStart,
        endDate,
        trialEnd,
        txId,
        subscriptionId,
      ]
    );

    // console.log("✅ Subscription record created");

    await pool.query(
      `UPDATE professional_topups
       SET status='completed', updated_at=NOW()
       WHERE transaction_ref=$1`,
      [session.id]
    );

    // console.log("✅ Pro subscription processing complete");
  } catch (error: any) {
    // console.error("❌ handleProSubscription error:", {
    //   message: error.message,
    //   professionalId: session.metadata?.professionalId,
    //   packageId: session.metadata?.packageId,
    //   sessionId: session.id
    // });
    throw error;
  }
}

async function handleRecurringPayment(invoice: any, subscription: Stripe.Subscription) {
  try {
    const subscriptionId = subscription.id;

    // console.log("🔄 Processing recurring payment:", {
    //   subscriptionId,
    //   invoiceId: invoice.id,
    //   billingReason: invoice.billing_reason,
    // });

    const subRes = await pool.query(
      `SELECT subscription_id, user_id, package_id, end_date 
       FROM professional_subscriptions 
       WHERE subscription_id=$1 
       ORDER BY end_date DESC LIMIT 1`,
      [subscriptionId]
    );

    if (!subRes.rows.length) {
      console.warn(`⚠️ No subscription found for ${subscriptionId}`);
      return;
    }

    const { user_id, package_id, end_date } = subRes.rows[0];

    const pkgRes = await pool.query(
      `SELECT duration_months FROM professional_packages WHERE package_id=$1`,
      [package_id]
    );

    if (pkgRes.rows.length === 0) {
      throw new Error(
        `Package ${package_id} no longer exists. Cannot renew subscription.`
      );
    }

    const durationMonths = pkgRes.rows[0].duration_months || 1;

    await pool.query(
      `INSERT INTO professional_subscriptions
        (user_id, package_id, status, start_date, end_date, subscription_id)
       VALUES ($1,$2,'active',$3, ($3 + make_interval(months => $4)),$5)`,
      [user_id, package_id, end_date, durationMonths, subscriptionId]
    );

    // console.log(`✅ Renewed subscription for ${durationMonths} months`);
  } catch (error: any) {
    console.error("❌ handleRecurringPayment error:", error.message);
    throw error;
  }
}

async function handleInvoicePaymentFailed(invoice: any) {
  const subscriptionId = invoice.subscription;
  if (!subscriptionId) {
    // console.log("ℹ️ Payment failed for non-subscription invoice");
    return;
  }

  await pool.query(
    `UPDATE professional_subscriptions 
     SET status='past_due' 
     WHERE subscription_id=$1`,
    [subscriptionId]
  );
  // console.log(`⚠️ Pro subscription ${subscriptionId} marked as past_due`);
}


async function handleCanceledSubscription(subscription: any) {
  // console.log(`🚫 Subscription canceled: ${subscription.id}`);

  await pool.query(
    `UPDATE professional_subscriptions 
     SET status='canceled' 
     WHERE subscription_id=$1`,
    [subscription.id]
  );
  // console.log(`✅ Pro subscription ${subscription.id} marked as canceled`);
}