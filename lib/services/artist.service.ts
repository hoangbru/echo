import { createClient } from "../supabase/server";

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
      console.error("Đã có lỗi xảy ra, vui lòng thử lại sau!");
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
      console.error("Đã có lỗi xảy ra, vui lòng thử lại sau!");
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

  async getCurrentArtistProfile(userId: string) {
    const { data, error } = await supabase
      .from("artist")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Đã có lỗi xảy ra, vui lòng thử lại sau!");
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
