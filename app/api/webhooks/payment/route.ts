import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import { stripe } from "@/lib/payment/stripe";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session.metadata?.userId;

    if (!userId) {
      return new NextResponse("User ID is missing in session metadata", {
        status: 400,
      });
    }

    const { error } = await supabaseAdmin
      .from("user")
      .update({
        is_premium: true,
        // Gia hạn 30 ngày (chu kỳ tháng)
        premium_expires_at: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) {
      console.error(`Database update failed for user ${userId}:`, error);
      return new NextResponse("Database Update Error", { status: 500 });
    }

    console.log(`Cấp quyền Echo Pro thành công cho user: ${userId}`);
  }

  return new NextResponse("OK", { status: 200 });
}
