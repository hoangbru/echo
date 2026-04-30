import { keysToCamel } from "../utils/format";

export const UserService = {
  async getUserProfile(supabase: any, userId: string, fields: string = "*") {
    const { data, error } = await supabase
      .from("user")
      .select(fields)
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      return null;
    }

    return keysToCamel(data);
  },
};
