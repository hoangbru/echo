import { createClient } from "@/lib/supabase/server";
import { create } from "domain";

const supabase = createClient();

export const ArtistService = {
  async getFeaturedArtists(limit: number = 6) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("artist")
      .select(`id, stage_name, profile_image, is_verified`)
      .eq("is_verified", true)
      .limit(limit);

    if (error) {
      console.error("Đã xảy ra lỗi, vui lòng thử lại sau!");
      return [];
    }

    return data.map((a: any) => ({
      id: a.id,
      stageName: a.stage_name,
      profileImage: a.profile_image,
      totalFollowers: 0,
      isVerified: a.is_verified || false,
    }));
  },

  async getPublicArtistProfile(artistId: string) {
    const { data, error } = await supabase
      .from("artists")
      .select("*")
      .eq("id", artistId)
      .eq("is_verified", true)
      .single();

    if (error) {
      console.error("Đã xảy ra lỗi, vui lòng thử lại sau!");
      return null;
    }

    return {
      id: data.id,
      userId: data.user_id,
      bio: data.bio || "",
      profileImage: data.profile_image || null,
      bannerImage: data.banner_image || null,
      isVerified: data.is_verified || false,
      socialLinks: data.social_links || null,
      stageName: data.stage_name || null,
      totalAlbums: data.total_albums || 0,
      totalFollowers: data.total_followers || 0,
      totalStreams: data.total_streams || 0,
      totalTracks: data.total_tracks || 0,
      createdAt: data.created_at || null,
      updatedAt: data.updated_at || null,
      verifiedAt: data.verified_at || null,
    };
  },

  async getCurrentArtistProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("artist")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("Đã xảy ra lỗi, vui lòng thử lại sau!");
      return null;
    }

    return {
      id: data.id,
      userId: data.user_id,
      bio: data.bio || "",
      profileImage: data.profile_image || null,
      bannerImage: data.banner_image || null,
      isVerified: data.is_verified || false,
      socialLinks: data.social_links || null,
      stageName: data.stage_name || null,
      totalAlbums: data.total_albums || 0,
      totalFollowers: data.total_followers || 0,
      totalStreams: data.total_streams || 0,
      totalTracks: data.total_tracks || 0,
      createdAt: data.created_at || null,
      updatedAt: data.updated_at || null,
      verifiedAt: data.verified_at || null,
    };
  },
};

export const ArtistStudioService = {
  async getMyStudioTracks(
    userId: string,
    page: number = 0,
    limit: number = 10,
  ) {
    const from = page * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("track")
      .select(
        `
        id, title, duration, audio_url, image_url, created_at,
        artists!inner ( user_id ) 
      `,
        { count: "exact" },
      ) // Đếm tổng số bài để làm phân trang
      .eq("artists.user_id", userId) // Lọc thẳng qua bảng joined!
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Lỗi lấy bài hát Studio");
      return { tracks: [], total: 0 };
    }

    const formattedTracks = data.map((t: any) => ({
      id: t.id,
      title: t.title,
      duration: t.duration || 0,
      audioUrl: t.audio_url,
      imageUrl: t.image_url,
      createdAt: t.created_at,
    }));

    return { tracks: formattedTracks, total: count || 0 };
  },
};
