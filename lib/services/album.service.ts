import { createClient } from "../supabase/server";
import { keysToCamel } from "../utils/format";

export const AlbumService = {
  async getNewReleases() {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("album")
      .select(
        `
      id, 
      title, 
      cover_image, 
      release_date,
      album_type,
      artist (id, stage_name)
    `,
      )
      .eq("is_published", true)
      .order("release_date", { ascending: false })
      .limit(10);

    if (error) {
      return [];
    }

    return keysToCamel(data);
  },

  async getTrending() {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("album")
      .select(
        `
      id, 
      title, 
      cover_image, 
      release_date,
      album_type,
      artist (id, stage_name)
    `,
      )
      .eq("is_published", true)
      .order("total_streams", { ascending: false })
      .limit(10);

    if (error) {
      return [];
    }

    return keysToCamel(data);
  },

  async getById(supabase: any, albumId: string) {
    const { data, error } = await supabase
      .from("album")
      .select("*")
      .eq("id", albumId)
      .maybeSingle();

    if (error) {
      return null;
    }

    return keysToCamel(data);
  },
};
