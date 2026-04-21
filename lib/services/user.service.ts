export const UserService = {
  async getUserProfileById(supabase: any, userId: string) {
    const { data, error } = await supabase
      .from("user")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("Đã có lỗi xảy ra, vui lòng thử lại sau!");
      return null;
    }

    return data;
  },
};
