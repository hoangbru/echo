import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";

export function useSearch(
  query: string,
  types: string[] = ["track", "artist", "album"],
) {
  return useQuery({
    queryKey: ["search", query, types],
    queryFn: async () => {
      const res = await apiClient.get("/search", {
        params: { q: query, types: types.join(",") },
      });
      return res;
    },
    enabled: !!query,
    staleTime: 5 * 60 * 1000,
  });
}
