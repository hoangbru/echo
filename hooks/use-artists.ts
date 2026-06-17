import { apiClient } from "@/lib/axios";
import { ArtistProfile, QueryParams } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

export function useArtistDetail(id: string, by: "id" | "userId" = "id") {
  return useQuery({
    queryKey: ["artist-detail", id, by],
    queryFn: async () => {
      const res = await apiClient.get(`/artists/${id}`, {
        params: { by }, 
      });
      return res.data.data as ArtistProfile;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateArtist(artistId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await apiClient.patch(`/artists/${artistId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artist-detail", artistId] });
      queryClient.invalidateQueries({ queryKey: ["artists"] });
    },
  });
}
