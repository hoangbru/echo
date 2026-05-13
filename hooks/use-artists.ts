import { apiClient } from "@/lib/axios";
import { QueryParams } from "@/types";
import { useQuery } from "@tanstack/react-query";

type ArtistQueryParams = QueryParams & {
  isVerified?: boolean;
  sortBy?: string;
  order?: string;
};

export const useArtists = (params?: ArtistQueryParams) => {
  return useQuery({
    queryKey: ["artists", params],
    queryFn: async () => {
      const res = await apiClient.get("/artists", { params });
      return res as { data: any[]; meta?: any };
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
