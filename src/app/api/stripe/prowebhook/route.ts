import Stripe from "stripe";
import pool from "@/lib/dbConnect";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const raw = await req.text();
  const sig = req.headers.get("stripe-signature") || "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error("⚠️ Webhook signature verification failed:", err?.message ?? err);
    return new Response("Invalid signature", { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const meta = (session.metadata || {}) as Record<string, string>;

      const existing = await pool.query(
        `SELECT transaction_id FROM payment_transactions WHERE reference_id = $1 LIMIT 1`,
        [session.id]
      );
      if (existing.rows.length > 0) {
        console.log("ℹ️ Session already processed:", session.id);
      } else {
        if (meta.type === "Pro_Subscription") {
          await handleProSubscription(session, meta);
        }  else {
          console.log("⚠️ Unknown session metadata type:", meta.type, meta);
        }
      }
    } else {
      console.log("⤴️ Unhandled event type:", event.type);
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err) {
    console.error("❌ Webhook handler error:", err);
    return new Response("Webhook processing error", { status: 500 });
  }
}


async function handleProSubscription(session: Stripe.Checkout.Session, meta: Record<string, string>) {
  const ref = session.id;
  const professionalId = Number(meta.professionalId || meta.userId); // accept both if sometime different
  const packageId = Number(meta.packageId);
  const amount = Number(meta.amount || 0);

  if (!professionalId || !packageId || !amount) {
    console.warn("⚠️ Invalid metadata for Pro_Subscription:", meta);
    return;
  }

  console.log("➡️ Activating Pro subscription:", { professionalId, packageId, amount, ref });

  const pkgRes = await pool.query(`SELECT duration_months FROM professional_packages WHERE package_id = $1`, [packageId]);
  if (!pkgRes.rows.length) {
    throw new Error("Package not found: " + packageId);
  }
  const durationMonths = pkgRes.rows[0].duration_months || 1;

  const txRes = await pool.query(
    `INSERT INTO payment_transactions
      (reference_id, professional_id, transaction_type, amount, credits_used, payment_gateway, status, remarks, created_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW())
     RETURNING transaction_id`,
    [ref, professionalId, 'subscription', amount, 0, 'stripe', 'completed', `Checkout session ${session.id}`]
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
   VALUES ($1,$2,$3,NOW(), (NOW() + make_interval(months => $4)), $5, $6, NOW())`,
  [professionalId, packageId, 'active', durationMonths, false, txId]
);
    console.log("🔁 Extended existing subscription for user", professionalId);
  } else {
    await pool.query(
      `INSERT INTO professional_subscriptions
         (user_id, package_id, status, start_date, end_date, cancel_at_period_end, payment_transaction_id, created_at)
       VALUES ($1,$2,$3,NOW(), (NOW() + ($4 || ' month')::interval), $5, $6, NOW())`,
      [professionalId, packageId, 'active', durationMonths, false, txId]
    );
    console.log("✅ Created new subscription for user", professionalId);
  }

  await pool.query(
    `UPDATE professional_topups
     SET status = 'completed', payment_transaction_id = $1, updated_at = NOW()
     WHERE transaction_ref = $2`,
    [txId, ref]
  );

  console.log("✅ Pro subscription processed:", ref);
}
