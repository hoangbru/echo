import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfileClient from "./profile-client";
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

  const dbUser = await getUserProfileById(user.id);

  if (!dbUser) {
    console.log("Không tìm thấy dbUser, đang chuyển hướng...");
    return <div>Không thể tải thông tin người dùng. Vui lòng thử lại.</div>;
  }
  const profileData = {
    id: dbUser.id,
    email: dbUser.email,
    fullName: dbUser.fullName || "Người dùng ẩn danh",
    avatarUrl:
      dbUser.avatar,
    username: dbUser.username || "Chưa có username",
    bio: dbUser.bio || "Chưa có tiểu sử.",
    followers: 0,
    following: 0,
    totalLikes: 0,
    totalPlaylists: 0,
    isPremium: dbUser.isPremium || false,
  };

  return <ProfileClient initialProfile={profileData} />;
}
