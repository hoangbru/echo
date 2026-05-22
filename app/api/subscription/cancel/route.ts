import { NextResponse } from "next/server";
import { authorizeApi } from "@/lib/session";
import { UserRole } from "@/types";
import { stripe } from "@/lib/payment/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const auth = await authorizeApi([UserRole.USER]);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const supabase = createClient();

  const { data: user } = await supabase
    .from("user")
    .select("stripe_subscription_id, premium_expires_at")
    .eq("id", auth.user!.id)
    .single();

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Stripe: hủy cuối kỳ, không hủy ngay
  if (user.stripe_subscription_id) {
    await stripe.subscriptions.update(user.stripe_subscription_id, {
      cancel_at_period_end: true,
    });

    await supabase
      .from("user")
      .update({ subscription_status: "cancelling" })
      .eq("id", auth.user!.id);

    return NextResponse.json({
      message: "Gói sẽ hết hạn vào cuối kỳ thanh toán",
      expires_at: user.premium_expires_at,
    });
  }

  // VNPay/ZaloPay: không có gì để hủy
  return NextResponse.json({
    message: "Gói của bạn sẽ không được gia hạn tự động",
    expires_at: user.premium_expires_at,
  });
}
