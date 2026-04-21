type GetGenresParams = {
  search?: string;
  page?: number;
  limit?: number;
};

export const GenreService = {
  async getGenres(supabase: any, params?: GetGenresParams) {
    const { search = "", page = 1, limit = 10 } = params || {};

    let query = supabase
      .from("genre")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (search) query = query.ilike("name", `%${search}%`);

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;
    if (error) throw new Error("Đã có lỗi xảy ra, vui lòng thử lại sau!");

    return { data: data || [], totalCount: count || 0 };
  },
};
