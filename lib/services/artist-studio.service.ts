import { QueryParams } from "@/types";
import { removeVietnameseTones } from "../utils/utils";

type GetParams = QueryParams & {
  status: string;
};

export const ArtistStudioService = {
  async getMyTracks(supabase: any, userId: string, params?: GetParams) {
    const { search = "", page = 1, limit = 10, status = "all" } = params || {};

    let query = supabase
      .from("track")
      .select("*, genre(name)", { count: "exact" })
      .eq("artist_id", userId)
      .order("created_at", { ascending: false });

    if (search) {
      const cleanSearch = removeVietnameseTones(search);
      query = query.ilike("title_search", `%${cleanSearch}%`);
    }

    if (status === "public") query = query.eq("is_published", true);
    if (status === "private") query = query.eq("is_published", false);

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;
    if (error) {
      console.error("Lỗi khi lấy tracks của nghệ sĩ:", error);
      return { data: [], totalCount: 0 };
    }

    return { data: data || [], totalCount: count || 0 };
  },

  async getMyAlbums(supabase: any, userId: string, params?: GetParams) {
    const { search = "", status = "all" } = params || {};

    let query = supabase
      .from("album")
      .select("*, track(count)", { count: "exact" })
      .eq("artist_id", userId)
      .order("created_at", { ascending: false });

    if (search) {
      const cleanSearch = removeVietnameseTones(search);
      query = query.ilike("title_search", `%${cleanSearch}%`);
    }

    if (status === "public") query = query.eq("is_published", true);
    if (status === "private") query = query.eq("is_published", false);

    const { data, count, error } = await query;
    if (error) {
      console.error("Đã có lỗi xảy ra:", error);
      return { data: [], totalCount: 0 };
    }

    const formattedData = (data || []).map((album: any) => ({
      ...album,
      track_count: album.track?.[0]?.count || 0,
    }));

    return { data: formattedData, totalCount: count || 0 };
  },

  async getAlbumsMinimal(
    supabase: any,
    artistId: string,
    fields: string = "id, title, cover_image, is_published, release_date",
  ): Promise<any[]> {
    const { data, error } = await supabase
      .from("album")
      .select(fields)
      .eq("artist_id", artistId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Lỗi khi lấy albums minimal:", error);
      return [];
    }

    return data || [];
  },
};
