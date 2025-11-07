import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "aud",
            product_data: {
              name: body.productName || "Test Product",
            },
            unit_amount: body.amount * 100, 
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    return new Response(JSON.stringify({ error: "Stripe Checkout failed" }), {
      status: 500,
    });
  }
}