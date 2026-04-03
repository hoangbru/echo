import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfileClient from "./profile-client";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }
  
  const profileData = {
    id: user.id,
    email: user.email,
    fullName: user.user_metadata?.full_name || "Người dùng ẩn danh",
    avatarUrl:
      user.user_metadata?.avatar_url ||
      "https://placehold.co/150x150?text=No+Avatar",
    username: "musiclover",
    bio: "Passionate about discovering new music and artists",
    followers: 1250,
    following: 432,
    totalLikes: 156,
    totalPlaylists: 8,
    isPremium: true,
  };

  return <ProfileClient initialProfile={profileData} />;
}
