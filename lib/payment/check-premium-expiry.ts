// Gọi trong middleware hoặc API /api/profile
import { supabaseAdmin } from "../supabase/admin";

export async function checkAndRevokePremium(userId: string) {
  const { data } = await supabaseAdmin
    .from("user")
    .select("is_premium, premium_expires_at")
    .eq("id", userId)
    .maybeSingle();

  if (
    data?.is_premium &&
    data.premium_expires_at &&
    data.premium_expires_at < new Date()
  ) {
    await supabaseAdmin
      .from("user")
      .update({
        is_premium: false,
      })
      .eq("id", userId);
    return false;
  }

  return data?.is_premium ?? false;
}
