import { redirect } from "next/navigation";

import ProfileClient from "./profile-client";

import { createClient } from "@/lib/supabase/server";
import { getUserProfileById } from "@/lib/services/user.service";

export default async function ProfilePage() {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/auth/login");
  }

  const profile = await getUserProfileById(user.id);

  if (!profile) {
    console.log("Không tìm thấy profile, đang chuyển hướng...");
    return <div>Không thể tải thông tin người dùng. Vui lòng thử lại.</div>;
  }

  return <ProfileClient initialProfile={profile} />;
}
