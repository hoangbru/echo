import { PREMIUM_DURATION_DAYS } from "@/constants/payment";
import { supabaseAdmin } from "../supabase/admin";

export async function activatePremium(userId: string) {
  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setDate(expiresAt.getDate() + PREMIUM_DURATION_DAYS);

  await supabaseAdmin
    .from("user")
    .update({
      is_premium: true,
      premium_expires_at: expiresAt,
    })
    .eq("id", userId);
}
