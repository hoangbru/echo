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
};
