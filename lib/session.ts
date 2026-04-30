import { createClient } from "@/lib/supabase/server";
import { UserRole } from "@/types";

export async function authorizeApi(allowedRoles: UserRole[] = []) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Vui lòng đăng nhập để thực hiện", status: 401 };

  const [userRes, artistRes] = await Promise.all([
    supabase.from("user").select("role").eq("id", user.id).single(),
    supabase.from("artist").select("id").eq("user_id", user.id).maybeSingle(),
  ]);

  if (userRes.error) console.error("Lỗi lấy User Role:", userRes.error.message);

  const role = userRes.data?.role as UserRole;
  const artistId = artistRes.data?.id;

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return { error: "Bạn không có quyền thực hiện hành động này", status: 403 };
  }

  return {
    user,
    role,
    artistId,
    error: null,
  };
}
