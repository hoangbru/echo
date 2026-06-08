import { apiClient } from "@/lib/axios";
import { Album, QueryParams } from "@/types";
import type { TrackResult, AlbumResult } from "@/types/search";
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
      return res.data as { data: any[]; meta?: any };
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

      return res.data as { data: Album[] };
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
      return res.data as { data: any };
    },
    enabled: !!artistId,
  });
}

export function useTracksByArtist(artistId: string) {
  return useQuery({
    queryKey: ["tracks", "by-artist", artistId],
    queryFn: async () => {
      const res = await apiClient.get("/tracks", {
        params: { artistId, limit: 20, isPublished: true },
      });
      return res.data as { data: TrackResult[]; meta?: any };
    },
    enabled: !!artistId,
    staleTime: 2 * 60 * 1000,
  });
}

export function useAlbumsByArtist(artistId: string) {
  return useQuery({
    queryKey: ["albums", "by-artist", artistId],
    queryFn: async () => {
      const res = await apiClient.get("/albums", {
        params: { artistId, limit: 20, status: "public" },
      });
      return res.data as { data: AlbumResult[]; meta?: any };
    },
    enabled: !!artistId,
    staleTime: 2 * 60 * 1000,
  });
}
