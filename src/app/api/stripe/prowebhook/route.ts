import Stripe from "stripe";
import pool from "@/lib/dbConnect";

export const config = { api: { bodyParser: false } };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const raw = await req.text();
  const signature = req.headers.get("stripe-signature")!;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(raw, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Webhook signature fail", err);
    return new Response("Invalid signature", { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = (session.metadata || {}) as Record<string,string>;

      if (metadata.type === 'Pro_Subscription') {
        await handleProSubscription(session, metadata);
      } else {
        console.log("Unknown metadata type:", metadata.type);
      }
    } 

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err) {
    console.error("Webhook processing error", err);
    return new Response("Webhook processing error", { status: 500 });
  }
}

async function handleProSubscription(session: Stripe.Checkout.Session, meta: Record<string,string>) {
  const ref = session.id;
  const userId = Number(meta.userId);
  const packageId = Number(meta.packageId);
  const amount = Number(meta.amount) || 0;

   if (!userId || !packageId || !amount) {
      console.warn("⚠️ Invalid metadata. Ignoring.");
      return new Response(JSON.stringify({ received: true }), { status: 200 });
    }


  const pkgRes = await pool.query(`SELECT duration_months FROM professional_packages WHERE package_id = $1`, [packageId]);
  if (!pkgRes.rows.length) throw new Error("Package not found");

  const durationMonths = pkgRes.rows[0].duration_months || 1;

 const txRes = await pool.query(
    `INSERT INTO payment_transactions
      (reference_id, professional_id, transaction_type, amount, credits_used, payment_gateway, status, remarks, created_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW())
     RETURNING transaction_id`,
    [ref, userId, 'subscription', amount, 0, 'stripe', 'completed', `Checkout Session: ${session.payment_intent ?? session.id}`]
  );
  const txId = txRes.rows[0].transaction_id;

  const startDate = new Date();  await pool.query(
    `INSERT INTO professional_subscriptions
      (user_id, package_id, status, start_date, end_date, cancel_at_period_end, payment_transaction_id, created_at)
     VALUES ($1,$2,$3,$4, (NOW() + ($5 || ' month')::interval), $6, $7, NOW())
     RETURNING subscription_id`,
    [userId, packageId, 'active', startDate, durationMonths, false, txId]
  );
   await pool.query(
        `UPDATE professional_topups
         SET status = 'completed', payment_transaction_id= $1,updated_at = NOW()
         WHERE transaction_ref = $2`,
        [txId,ref]
      );

  console.log("Pro subscription created for user", userId);
}