import { createClient } from "@/lib/supabase/server";

export const TrackService = {
  async getTrendingTracks(limit: number = 10) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("track")
      .select(
        `
        id, title, duration, audio_url, image_url,
        artist:artist (
          id,
          user:user ( username )
        ),
        album:album ( id, title )
      `,
      )
      .eq("is_published", true)
      .limit(limit);

    if (error) {
      console.error("Đã xảy ra lỗi, vui lòng thử lại sau!");
      return [];
    }

    return data.map((t: any) => ({
      id: t.id,
      title: t.title,
      duration: t.duration,
      audioUrl: t.audio_url,
      imageUrl: t.image_url,
      artistId: t.artist?.id || "unknown",
      artist: t.artist?.user?.username || "Unknown Artist",
      albumId: t.album?.id,
      album: t.album?.title,
    }));
  },

  async getNewReleases(limit: number = 10) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("track")
      .select(
        `
        id, title, duration, audio_url, image_url, created_at,
        artist:artist (
          id,
          user:user ( username )
        ),
        album:album ( id, title )
      `,
      )
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Đã xảy ra lỗi, vui lòng thử lại sau!");
      return [];
    }

    return data.map((t: any) => ({
      id: t.id,
      title: t.title,
      duration: t.duration,
      audioUrl: t.audio_url,
      imageUrl: t.image_url,
      artistId: t.artist?.id || "unknown",
      artist: t.artist?.user?.username || "Unknown Artist",
      albumId: t.album?.id,
      album: t.album?.title,
    }));
  },
};
