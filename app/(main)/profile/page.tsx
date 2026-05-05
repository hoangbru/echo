import { redirect } from "next/navigation";

import { ProfileClient } from "@/components/features/guest/profile";

import { createClient } from "@/lib/supabase/server";
import { UserService } from "@/lib/services/user.service";

export default async function ProfilePage() {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/auth/login");
  }

  const profile = await UserService.getUserProfile(supabase, user.id);

  if (!profile) {
    return <div>Không thể tải thông tin người dùng. Vui lòng thử lại.</div>;
  }

  return <ProfileClient initialProfile={profile} />;
}
