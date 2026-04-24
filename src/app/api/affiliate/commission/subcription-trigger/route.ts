import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";

const COMMISSION_RATE = 20; // percent
const MAX_MONTHS = 12; // commission window

const INTERNAL_SECRET = process.env.NEXT_PUBLIC_AFFILIATE_WEBHOOK_SECRET?? "";

export async function POST(req: Request) {
  // Verify internal caller
  const secret = req.headers.get("x-affiliate-secret");
  if (INTERNAL_SECRET && secret !== INTERNAL_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const client = await pool.connect();
  try {
    const { subscriptionId, paymentTransactionId } = await req.json();

    if (!subscriptionId)
      return NextResponse.json(
        { error: "subscriptionId required" },
        { status: 400 }
      );

    await client.query("BEGIN");

    const { rows: subRows } = await client.query(
      `SELECT
         ps.subscription_id,
         ps.user_id           AS referred_user_id,
         ps.package_id,
         ps.start_date,
         ps.end_date,
         ps.status            AS sub_status,
         pp.price             AS package_price,
         pp.name              AS package_name
       FROM public.professional_subscriptions ps
       JOIN public.professional_packages pp ON pp.package_id = ps.package_id
       WHERE ps.subscription_id = $1`,
      [subscriptionId]
    );

    if (!subRows.length) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    const sub = subRows[0];

    const { rows: refRows } = await client.query(
      `SELECT
         r.referral_id,
         r.referrer_id,
         r.referred_user_id,
         r.status             AS referral_status,
         r.first_subscribed_at,
         r.commission_eligible_until,
         r.subscription_id    AS linked_subscription_id
       FROM public.referrals r
       WHERE r.referred_user_id = $1
         AND r.status NOT IN ('rejected', 'paid')
       ORDER BY r.created_at DESC
       LIMIT 1`,
      [sub.referred_user_id]
    );

    if (!refRows.length) {
      await client.query("ROLLBACK");
      return NextResponse.json({
        skipped: true,
        reason: "No referral found for this user",
      });
    }

    const referral = refRows[0];

    let firstSubscribedAt: Date;
    let commissionEligibleUntil: Date;
    let subscriptionMonth: number;

    if (!referral.first_subscribed_at) {
      // First subscription ever → start the 12-month clock
      firstSubscribedAt = new Date(sub.start_date);
      commissionEligibleUntil = new Date(firstSubscribedAt);
      commissionEligibleUntil.setMonth(
        commissionEligibleUntil.getMonth() + MAX_MONTHS
      );
      subscriptionMonth = 1;

      // Update referral: mark as subscribed, link subscription, start clock
      await client.query(
        `UPDATE public.referrals SET
           status                    = 'subscribed',
           subscription_id           = $1,
           first_subscribed_at       = $2,
           commission_eligible_until = $3
         WHERE referral_id = $4`,
        [
          subscriptionId,
          firstSubscribedAt,
          commissionEligibleUntil,
          referral.referral_id,
        ]
      );
    } else {
      firstSubscribedAt = new Date(referral.first_subscribed_at);
      commissionEligibleUntil = new Date(referral.commission_eligible_until);

      const now = new Date();
      if (now > commissionEligibleUntil) {
        await client.query(
          `UPDATE public.referrals SET status = 'expired' WHERE referral_id = $1`,
          [referral.referral_id]
        );
        await client.query("COMMIT");
        return NextResponse.json({
          skipped: true,
          reason: "Commission window expired (12 months passed)",
        });
      }

      const msPerMonth = 1000 * 60 * 60 * 24 * 30.44;
      const monthsElapsed = Math.floor(
        (new Date(sub.start_date).getTime() - firstSubscribedAt.getTime()) /
          msPerMonth
      );
      subscriptionMonth = Math.min(monthsElapsed + 1, MAX_MONTHS);
    }

    // ── 4. Guard: prevent duplicate commission for same subscription period ──
    const { rows: dupCheck } = await client.query(
      `SELECT commission_id FROM public.affiliate_commissions
       WHERE referral_id      = $1
         AND subscription_id  = $2
         AND subscription_month = $3
       LIMIT 1`,
      [referral.referral_id, subscriptionId, subscriptionMonth]
    );

    if (dupCheck.length) {
      await client.query("ROLLBACK");
      return NextResponse.json({
        skipped: true,
        reason: "Commission already recorded for this subscription period",
      });
    }

    // ── 5. Calculate commission ──────────────────────────────────────────────
    const packagePrice = parseFloat(sub.package_price);
    const commissionAmount = parseFloat(
      ((packagePrice * COMMISSION_RATE) / 100).toFixed(2)
    );

    // ── 6. Insert commission record ──────────────────────────────────────────
    const { rows: commRows } = await client.query(
      `INSERT INTO public.affiliate_commissions (
         referral_id, referrer_id, referred_user_id,
         subscription_id, package_id, payment_transaction_id,
         package_price, commission_rate, commission_amount,
         subscription_month, period_start, period_end,
         status
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'pending')
       RETURNING *`,
      [
        referral.referral_id,
        referral.referrer_id,
        sub.referred_user_id,
        subscriptionId,
        sub.package_id,
        paymentTransactionId ?? null,
        packagePrice,
        COMMISSION_RATE,
        commissionAmount,
        subscriptionMonth,
        sub.start_date,
        sub.end_date,
      ]
    );

    // ── 7. Update running total on referral ──────────────────────────────────
    await client.query(
      `UPDATE public.referrals
       SET total_commission_earned = total_commission_earned + $1
       WHERE referral_id = $2`,
      [commissionAmount, referral.referral_id]
    );

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      commission: commRows[0],
      summary: {
        referrer_id: referral.referrer_id,
        referred_user_id: sub.referred_user_id,
        package_price: packagePrice,
        commission_rate: `${COMMISSION_RATE}%`,
        commission_amount: commissionAmount,
        subscription_month: subscriptionMonth,
        eligible_until: commissionEligibleUntil,
      },
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("POST /api/affiliate/commission/trigger:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
