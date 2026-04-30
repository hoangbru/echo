import { keysToCamel } from "../utils/format";

export const ArtistRequestService = {
  async getPendingRequest(supabase: any, userId: string) {
    const { data, error } = await supabase
      .from("artist_request")
      .select("status")
      .eq("user_id", userId)
      .eq("status", "PENDING")
      .maybeSingle();

    if (error) {
      console.error("Đã có lỗi xảy ra:", error.message);
      return null;
    }

    return keysToCamel(data);
  },
};
