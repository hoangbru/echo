import { QueryParams } from "@/types";
import { removeVietnameseTones } from "../utils/string";

type GetMyTracksParams = QueryParams & {
  status: string;
};

export const ArtistStudioService = {
  async getMyTracks(supabase: any,userId: string, params?: GetMyTracksParams) {
    const {
      search = "",
      page = 1,
      limit = 10,
      status = "all",
    } = params || {};

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

  async getMyAlbums(supabase: any,userId: string, params?: QueryParams) {
    const { search = "", page = 1, limit = 10 } = params || {};

    let query = supabase
      .from("album")
      .select("*")
      .eq("artist.user_id", userId)
      .order("created_at", { ascending: false });

    if (search) query = query.ilike("title", `%${search}%`);

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;
    if (error) return { data: [], totalCount: 0 };

    return { data: data || [], totalCount: count || 0 };
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
