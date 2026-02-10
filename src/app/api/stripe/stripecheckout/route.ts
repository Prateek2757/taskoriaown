// import Stripe from "stripe";
// import { NextResponse } from "next/server";
// import pool from "@/lib/dbConnect";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// interface CheckoutRequestBody {
//   professionalId: string;
//   packageId: string;
//   amount: number;
//   credits?: number;
//   packageName: string;
// }

// export async function POST(request: Request) {
//   try {
//     const body: CheckoutRequestBody = await request.json();
//     const { professionalId, packageId, amount, credits, packageName } = body;

//     if (!professionalId || !packageId || !amount || !packageName) {
//       console.warn("Missing required fields:", body);
//       return NextResponse.json(
//         { error: "Missing required fields", body },
//         { status: 400 }
//       );
//     }

//     const amountInCents = Math.round(Number(amount) * 100);
//     if (!credits) {
//       const activeSub = await pool.query(
//         `SELECT subscription_id FROM professional_subscriptions
//      WHERE user_id = $1 AND status = 'active' AND end_date > NOW()
//      LIMIT 1`,
//         [professionalId]
//       );

//       if (activeSub.rows.length > 0) {
//         return NextResponse.json(
//           { error: "You already have an active Taskoria Pro subscription." },
//           { status: 400 }
//         );
//       }
//     }

//     let successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing/my_credits`;

//     if (!credits) {
//       successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/provider/dashboard`;
//     }
//     const session = await stripe.checkout.sessions.create({
//       mode: "subscription",
//       payment_method_types: ["card"],
//       line_items: [
//         {
//           price:"price_1SxjCxFX22YUbYhB4C0DFt7t",
//           // price_data: {
//           //   currency: "aud",
//           //   product_data: { name: packageName },
//           //   unit_amount: amountInCents,
//           // },
//           quantity: 1,
//         },
//       ],
//       metadata: {
//         type: credits ? "Credit_Topup" : "Pro_Subscription",
//         professionalId,
//         packageId,
//         credits: String(credits || 0),
//         amount: String(amount),
//       },

//       success_url: successUrl,
//       cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/provider/dashboard`,
//     });

//     if (credits) {
//       await pool.query(
//         `INSERT INTO credit_topups
//         (professional_id, package_id, amount, credits_added, payment_method, transaction_ref, status)
//         VALUES ($1, $2, $3, $4, 'stripe', $5, 'pending')`,
//         [professionalId, packageId, amount, credits, session.id]
//       );
//     } else {
//       await pool.query(
//         `Insert INTO professional_topups (user_id,package_id, amount,payment_method,transaction_ref,status)
//         VALUES ($1,$2,$3,'stripe',$4,'pending')`,
//         [professionalId, packageId, amount, session.id]
//       );
//     }
//     // console.log("✅ Stripe checkout session created successfully:", session.id);

//     return NextResponse.json({ url: session.url });
//   } catch (error: any) {
//     console.error(
//       "❌ Stripe checkout error full:",
//       JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
//     );

//     const errorDetails = {
//       name: error.name,
//       message: error.message,
//       stack: error.stack,
//       ...(error.code && { code: error.code }),
//       ...(error.raw && { raw: error.raw }),
//     };

//     return NextResponse.json(
//       {
//         error: "Checkout failed",
//         details: errorDetails,
//       },
//       { status: 500 }
//     );
//   }
// }
import Stripe from "stripe";
import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface CheckoutRequestBody {
  professionalId: string;
  packageId: string;
  amount: number;
  credits?: number;
  packageName: string;
  freeTrailDays?: number;
}

export async function POST(request: Request) {
  try {
    const body: CheckoutRequestBody = await request.json();
    const {
      professionalId,
      packageId,
      amount,
      credits,
      packageName,
      freeTrailDays,
    } = body;

    if (
      !professionalId ||
      !packageId ||
      !packageName ||
      freeTrailDays === undefined
    ) {
      return NextResponse.json(
        { error: "Missing required fields", body },
        { status: 400 }
      );
    }

    const amountInCents = Math.round(Number(amount) * 100);

    if (!credits) {
      const activeSub = await pool.query(
        `SELECT subscription_id FROM professional_subscriptions 
         WHERE user_id = $1 AND status = 'active' AND end_date > NOW() 
         LIMIT 1`,
        [professionalId]
      );

      if (activeSub.rows.length > 0) {
        return NextResponse.json(
          { error: "You already have an active Taskoria Pro subscription." },
          { status: 400 }
        );
      }
    }

    const successUrl = credits
      ? `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing/my_credits`
      : `${process.env.NEXT_PUBLIC_APP_URL}/provider/dashboard`;

    let sessionData: any = {
      payment_method_types: ["card"],
      metadata: {
        professionalId,
        packageId,
        amount: String(amount),
        credits: String(credits || 0),
        type: credits ? "credit_onetime" : "pro_subscription",
      },
      success_url: successUrl,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/provider/dashboard`,
    };

    if (credits) {
      sessionData.mode = "payment";
      sessionData.line_items = [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${packageName} - ${credits} Credits`,
              description: `One-time purchase of ${credits} credits`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ];

      console.log("💳 Creating ONE-TIME credit purchase checkout:", {
        professionalId,
        packageId,
        credits,
        amount: amountInCents / 100,
      });
    } else {
      // PRO SUBSCRIPTION - Recurring subscription
      const pkgRes = await pool.query(
        `SELECT stripe_price_id, is_active 
         FROM professional_packages 
         WHERE package_id = $1`,
        [packageId]
      );

      if (!pkgRes.rows.length) {
        return NextResponse.json(
          {
            error: "Package not found",
            details: `Professional package ${packageId} does not exist in database`,
          },
          { status: 400 }
        );
      }

      if (!pkgRes.rows[0].is_active) {
        return NextResponse.json(
          { error: "This package is no longer available" },
          { status: 400 }
        );
      }

      if (!pkgRes.rows[0].stripe_price_id) {
        return NextResponse.json(
          { error: "Package not configured for Stripe payments" },
          { status: 400 }
        );
      }

      const stripePriceId = pkgRes.rows[0].stripe_price_id;

      sessionData.mode = "subscription";
      sessionData.line_items = [{ price: stripePriceId, quantity: 1 }];

      sessionData.subscription_data = {
        trial_period_days: freeTrailDays || 0,
        metadata: {
          type: "pro_subscription",
          professionalId,
          packageId,
          amount: String(amount),
        },
      };

      console.log("💼 Creating PRO subscription checkout:", {
        professionalId,
        packageId,
        amount,
        stripePriceId,
        trialDays: freeTrailDays,
      });
    }

    const session = await stripe.checkout.sessions.create(sessionData);

    if (credits) {
      await pool.query(
        `INSERT INTO credit_topups 
         (professional_id, package_id, amount, credits_added, payment_method, transaction_ref, status) 
         VALUES ($1,$2,$3,$4,'stripe',$5,'pending')`,
        [professionalId, packageId, amount, credits, session.id]
      );
    } else {
      await pool.query(
        `INSERT INTO professional_topups 
         (user_id, package_id, amount, payment_method, transaction_ref, status) 
         VALUES ($1,$2,$3,'stripe',$4,'pending')`,
        [professionalId, packageId, amount, session.id]
      );
    }

    console.log("✅ Checkout session created:", session.id);

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("❌ Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Checkout failed", details: error.message },
      { status: 500 }
    );
  }
}