export const UserService = {
  async getUserProfileById(supabase: any, userId: string) {
    return await supabase
      .from("user")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
  },
};
