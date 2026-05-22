import { NextResponse } from "next/server";
import Stripe, { CheckoutSession } from "stripe";
import { stripe } from "@/lib/payment/stripe";
import { createServiceClient } from "@/lib/supabase/service";
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

  const supabase = createServiceClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as CheckoutSession;

      if (session.mode === "subscription") {
        await supabase
          .from("user")
          .update({
            stripe_subscription_id: session.subscription as string,
            subscription_status: "active",
          })
          .eq("id", session.metadata?.userId);
      }
      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      const sub = await stripe.subscriptions.retrieve(
        (invoice.subscription ?? "") as string,
      );

      const { data: user } = await supabase
        .from("user")
        .select("id")
        .eq("stripe_subscription_id", sub.id)
        .single();

      if (user) {
        await activatePremium(user.id, new Date(sub.current_period_end * 1000));
      }
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const sub = await stripe.subscriptions.retrieve(
        invoice.subscription as string,
      );

      await supabase
        .from("user")
        .update({ subscription_status: "past_due" })
        .eq("stripe_subscription_id", sub.id);
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;

      await supabase
        .from("user")
        .update({
          is_premium: false,
          subscription_status: "cancelled",
          stripe_subscription_id: null,
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_subscription_id", sub.id);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
