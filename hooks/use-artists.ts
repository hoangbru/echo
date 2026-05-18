import { apiClient } from "@/lib/axios";
import { Album, QueryParams } from "@/types";
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

export function useAlbumsArtist(artistId: string, currentAlbumId: string) {
  return useQuery({
    queryKey: ["albums", "artist", artistId, "exclude", currentAlbumId],

    queryFn: async () => {
      const res = await apiClient.get(`/artists/${artistId}/albums`, {
        params: { exclude: currentAlbumId },
      });

      return res as { data: Album[] };
    },

    enabled: !!artistId && !!currentAlbumId,

    placeholderData: (previousData) => previousData,
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
