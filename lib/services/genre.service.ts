import { createClient } from "../supabase/server";
import { keysToCamel } from "../utils/format";

export const GenreService = {
  async getGenres() {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("genre")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (error) return [];

    return keysToCamel(data);
  },
};
