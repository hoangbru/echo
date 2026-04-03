import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { CookieToSet } from "./type";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
            console.log("COOKIES ĐÃ ĐƯỢC LƯU VÀO TRÌNH DUYỆT:", cookiesToSet);
          } catch (error) {
            console.error("LỖI KHÔNG THỂ LƯU COOKIE VÀO TRÌNH DUYỆT:", error);
          }
        },
      },
    }
  );
}
