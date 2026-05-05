import { apiClient } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useArtists = (params?: {
  q?: string;
  limit?: number;
  isVerified?: boolean;
  page?: number;
  sortBy?: string;
  order?: string;
}) => {
  return useQuery({
    queryKey: ["artists", params],
    queryFn: async () => {
      const res = await apiClient.get("/artists", { params });
      return res;
    },
  });
};

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
