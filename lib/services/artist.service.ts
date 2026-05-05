import { keysToCamel } from "../utils/format";

export const ArtistService = {
  async getFeaturedArtists(supabase: any) {
    const { data, error } = await supabase
      .from("artist")
      .select(`*`)
      .eq("is_verified", true)

    if (error) {
      console.error("Đã có lỗi xảy ra, vui lòng thử lại sau!");
      return [];
    }

    return keysToCamel(data);
  },

  async getPublicArtistProfile(supabase: any, artistId: string) {
    const { data, error } = await supabase
      .from("artist")
      .select("*")
      .eq("id", artistId)
      .eq("is_verified", true)
      .single();

    if (error) {
      console.error("Đã có lỗi xảy ra, vui lòng thử lại sau!");
      return null;
    }

    return keysToCamel(data);
  },

  async getCurrentArtist(supabase: any, userId: string) {
    const { data, error } = await supabase
      .from("artist")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Đã có lỗi xảy ra: ", error.message);
      return null;
    }
    return keysToCamel(data);
  },
};
