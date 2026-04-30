import { apiClient } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export function useArtists() {
  return useQuery({
    queryKey: ["artists", "all"],
    queryFn: async () => {
      const res = await apiClient.get("/artists");
      return res as { data: any[] };
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useArtistDetail(artistId: string) {
  return useQuery({
    queryKey: ["artist", artistId],
    queryFn: async () => {
      const res = await apiClient.get(`/studios/${artistId}`);
      return res as { data: any };
    },
    enabled: !!artistId,
  });
}
