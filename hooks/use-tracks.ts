import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { toast } from "sonner";
import { TrackDetail } from "@/types";

interface LikedTracksQueryParams {
  limit?: number;
}

interface LikedTracksResponse {
  data: TrackDetail[];
  meta?: {
    currentPage: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
  };
}

export function useTrackDetail(trackId: string) {
  return useQuery({
    queryKey: ["track", trackId],
    queryFn: async () => {
      const res = await apiClient.get(`/tracks/${trackId}`);
      return res.data.data as TrackDetail;
    },
    enabled: !!trackId,
  });
}

export function useLikedTracks({ limit }: LikedTracksQueryParams = {}) {
  return useInfiniteQuery<LikedTracksResponse, Error>({
    queryKey: ["liked-tracks", { limit }],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await apiClient.get("/users/liked-tracks", {
        params: {
          page: pageParam,
          limit,
        },
      });

      return res.data as LikedTracksResponse;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage?.meta?.hasNextPage) {
        return lastPage.meta.currentPage + 1;
      }
      return undefined;
    },
  });
}

export function useCreateTrack(albumId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await apiClient.post("/tracks", formData, {
        timeout: 0,
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tracks", "album-detail", albumId],
      });
      queryClient.invalidateQueries({ queryKey: ["albums"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Lỗi khi thêm bài hát");
    },
  });
}

export function useUpdateTrack(trackId: string, albumId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string;
      formData: FormData;
    }) => {
      const res = await apiClient.patch(`/tracks/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 0,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tracks", "album-detail", albumId],
      });
      queryClient.invalidateQueries({ queryKey: ["track", trackId] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Lỗi khi cập nhật");
    },
  });
}

export function useDeleteTrack(albumId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (trackId: string) => {
      const res = await apiClient.delete(`/tracks/${trackId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tracks", "album-detail", albumId],
      });
      queryClient.invalidateQueries({ queryKey: ["albums"] });

      toast.success("Đã xóa bài hát!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Lỗi khi xóa bài hát");
    },
  });
}
