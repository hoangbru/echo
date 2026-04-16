import { createClient } from "@/lib/supabase/server";
import { User } from "@/types/user.type";

const supabase = createClient();

export const UserService = {
  async getUserProfileById(userId: string) {
    const { data, error } = await supabase
      .from("user")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("Đã xảy ra lỗi, vui lòng thử lại sau!");
      return null;
    }

    return {
      id: data.id,
      email: data.email || null,
      fullName: data.full_name || "Người dùng ẩn danh",
      avatar: data.avatar || null,
      username: data.username || "Chưa có username",
      bio: data.bio || "Chưa có tiểu sử.",
      followers: data.followers || 0,
      following: data.following || 0,
      totalPlaylists: data.totalPlaylists || 0,
      isPremium: data.isPremium || false,
      createdAt: data.createdAt || null,
      lastLoginAt: data.lastLoginAt || null,
      premiumExpiresAt: data.premiumExpiresAt || null,
      role: data.role || "USER",
      updatedAt: data.updatedAt || null,
    };
  },
};
