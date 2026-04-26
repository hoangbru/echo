import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { toast } from "sonner";

export function useAlbumTracksDetail(albumId: string) {
  return useQuery({
    queryKey: ["tracks", "album-detail", albumId],
    queryFn: async () => {
      const res = await apiClient.get(`/albums/${albumId}/tracks`);

      return res as { data: any[]; meta?: any };
    },
    enabled: !!albumId,
  });
}

export function useTrackDetail(trackId: string) {
  return useQuery({
    queryKey: ["track", trackId],
    queryFn: async () => {
      const res = await apiClient.get(`/tracks/${trackId}`);
      return res as { data: any };
    },
    enabled: !!trackId,
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
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tracks", "album-detail", albumId],
      });
      queryClient.invalidateQueries({ queryKey: ["albums"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Lỗi khi thêm bài hát");
    },
  });
}

export function useUpdateTrack(albumId: string) {
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
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Lỗi khi cập nhật");
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
      toast.error(error.response?.data?.error || "Lỗi khi xóa bài hát");
    },
  });
}
