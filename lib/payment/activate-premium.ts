import { createServiceClient } from "../supabase/service";

export async function activatePremium(userId: string, expiresAt?: Date) {
  const supabase = createServiceClient();
  const now = new Date();
  const expiry = expiresAt ?? new Date(now.setDate(now.getDate() + 30));

  const { error } = await supabase
    .from("user")
    .update({
      is_premium: true,
      premium_expires_at: expiry.toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) throw new Error(`activatePremium failed: ${error.message}`);
}
