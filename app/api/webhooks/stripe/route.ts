import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/payment/stripe";
import { activatePremium } from "@/lib/payment/activate-premium";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.userId;

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    await activatePremium(userId);
  }

  return NextResponse.json({ received: true });
}

// Tắt bodyParser để Stripe verify signature được
export const config = { api: { bodyParser: false } };
