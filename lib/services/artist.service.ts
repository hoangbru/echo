export const ArtistService = {
  async getFeaturedArtists(supabase: any, limit: number = 6) {
    const { data, error } = await supabase
      .from("artist")
      .select(`id, stage_name, profile_image, is_verified`)
      .eq("is_verified", true)
      .limit(limit);

    if (error) {
      console.error("Đã có lỗi xảy ra, vui lòng thử lại sau!");
      return [];
    }

    return data;
  },

  async getPublicArtistProfile(supabase: any, artistId: string) {
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

    return data;
  },

  async getCurrentArtistProfile(supabase: any, userId: string) {
    return await supabase
      .from("artist")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
  },
};
