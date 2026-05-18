import { keysToCamel } from "../utils/format";

export const TrackService = {
  async getTrendingTracks(supabase: any, limit: number = 10) {
    const { data, error } = await supabase
      .from("track")
      .select(`*`)
      .eq("is_published", true)
      .order("total_streams", { ascending: false })
      .limit(limit);

    if (error) {
      return [];
    }

    return keysToCamel(data);
  },
  checkLikeStatus: async (supabase: any, userId: string, trackId: string) => {
    const { data } = await supabase
      .from("liked_tracks")
      .select("track_id")
      .eq("user_id", userId)
      .eq("track_id", trackId)
      .maybeSingle();

    return !!data;
  },

  likeTrack: async (supabase: any, userId: string, trackId: string) => {
    await supabase
      .from("liked_tracks")
      .insert({ user_id: userId, track_id: trackId });
  },

  unlikeTrack: async (supabase: any, userId: string, trackId: string) => {
    await supabase
      .from("liked_tracks")
      .delete()
      .match({ user_id: userId, track_id: trackId });
  },
};
