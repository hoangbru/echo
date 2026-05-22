// Gọi trong middleware hoặc API /api/profile
import { createServiceClient } from "../supabase/service";

export async function checkAndRevokePremium(userId: string) {
  const supabaseService = createServiceClient();
  const { data } = await supabaseService
    .from("user")
    .select("is_premium, premium_expires_at")
    .eq("id", userId)
    .maybeSingle();

  if (
    data?.is_premium &&
    data.premium_expires_at &&
    data.premium_expires_at < new Date()
  ) {
    await supabaseService
      .from("user")
      .update({
        is_premium: false,
      })
      .eq("id", userId);
    return false;
  }

  return data?.is_premium ?? false;
}
