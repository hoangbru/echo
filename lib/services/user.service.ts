import { createClient } from "@/lib/supabase/server";

export async function getUserProfileById(userId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("User")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("Lỗi khi fetch User:", error);
    return null;
  }

  return data;
}