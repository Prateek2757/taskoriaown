import Stripe from "stripe";
import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface CancelRequestBody {
  professionalId: string;
  subscriptionId: string;
  reason?: string;           // user-selected reason from the UI
  cancelImmediately?: boolean;
}

export async function POST(request: Request) {
  try {
    const body: CancelRequestBody = await request.json();
    const {
      professionalId,
      subscriptionId,
      reason = "Not specified",
      cancelImmediately = false,
    } = body;

    if (!professionalId || !subscriptionId) {
      return NextResponse.json(
        { error: "Missing required fields: professionalId and subscriptionId" },
        { status: 400 }
      );
    }

    // 1. Verify the subscription belongs to this professional
    const subRes = await pool.query(
      `SELECT subscription_id, user_id, package_id, status, end_date, cancel_at_period_end
       FROM professional_subscriptions
       WHERE subscription_id = $1 AND user_id = $2
       LIMIT 1`,
      [subscriptionId, professionalId]
    );

    if (subRes.rows.length === 0) {
      return NextResponse.json(
        { error: "Subscription not found or does not belong to this user" },
        { status: 404 }
      );
    }

    const sub = subRes.rows[0];

    if (sub.status === "canceled") {
      return NextResponse.json(
        { error: "Subscription is already canceled" },
        { status: 400 }
      );
    }

    if (sub.cancel_at_period_end && !cancelImmediately) {
      return NextResponse.json(
        { error: "Subscription is already scheduled to cancel at period end" },
        { status: 400 }
      );
    }

    let stripeSub: Stripe.Subscription;
    let accessEndsAt: string | null = null;

    if (cancelImmediately) {
      stripeSub = await stripe.subscriptions.cancel(subscriptionId);

      await pool.query(
        `UPDATE professional_subscriptions
         SET status = 'canceled',
             cancel_at_period_end = false,
             updated_at = NOW()
         WHERE subscription_id = $1`,
        [subscriptionId]
      );

      console.log(`✅ Subscription ${subscriptionId} canceled immediately`);
    } else {
      stripeSub = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });

      accessEndsAt = sub.end_date
      ? new Date(sub.end_date).toISOString()
      : null;
      await pool.query(
        `UPDATE professional_subscriptions
         SET cancel_at_period_end = true,
             updated_at = NOW()
         WHERE subscription_id = $1`,
        [subscriptionId]
      );

      console.log(
        `✅ Subscription ${subscriptionId} set to cancel at period end: ${accessEndsAt}`
      );
    }

    // 2. Record the cancellation + reason
    await pool.query(
      `INSERT INTO subscription_cancellations
         (professional_id, subscription_id, reason, cancel_immediately, access_ends_at, package_id)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        professionalId,
        subscriptionId,
        reason.trim() || "Not specified",
        cancelImmediately,
        accessEndsAt,
        sub.package_id ?? null,
      ]
    );

    console.log(
      `📝 Cancellation reason recorded: "${reason}" | professional: ${professionalId}`
    );

    return NextResponse.json({
      success: true,
      cancelImmediately,
      cancelAt: accessEndsAt,
      message: cancelImmediately
        ? "Your subscription has been canceled immediately."
        : `Your subscription will remain active until ${accessEndsAt}`,
    });
  } catch (error: any) {
    console.error("❌ Cancel subscription error:", error);
    return NextResponse.json(
      { error: "Cancellation failed", details: error.message },
      { status: 500 }
    );
  }
}

// Optional: GET to check cancellation status
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const professionalId = searchParams.get("professionalId");

  if (!professionalId) {
    return NextResponse.json({ error: "Missing professionalId" }, { status: 400 });
  }

  const subRes = await pool.query(
    `SELECT subscription_id, status, end_date, cancel_at_period_end, trail_end_date
     FROM professional_subscriptions
     WHERE user_id = $1 AND status IN ('active', 'trialing', 'past_due')
     ORDER BY end_date DESC
     LIMIT 1`,
    [professionalId]
  );

  if (subRes.rows.length === 0) {
    return NextResponse.json({ subscription: null });
  }

  return NextResponse.json({ subscription: subRes.rows[0] });
}