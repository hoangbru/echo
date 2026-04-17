"use client"

import { createClient } from "../supabase/client";

const supabase = createClient();

export const ArtistStudioService = {
  async getMyTracks(
    userId: string,
    params: {
      search?: string;
      statusFilter?: string;
      page: number;
      limit: number;
    },
  ) {
    let query = supabase
      .from("tracks")
      .select(
        `
        *,
        genre:genre(name),
        artist!inner(user_id)
      `,
        { count: "exact" },
      )
      .eq("artist.user_id", userId)
      .order("created_at", { ascending: false });

    if (params.search) query = query.ilike("title", `%${params.search}%`);
    if (params.statusFilter === "public")
      query = query.eq("is_published", true);
    if (params.statusFilter === "private")
      query = query.eq("is_published", false);

    const from = (params.page - 1) * params.limit;
    const to = from + params.limit - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;
    if (error) console.error("Đã có lỗi xảy ra, vui lòng thử lại sau!");

    return { tracks: data || [], totalCount: count || 0 };
  },
};
