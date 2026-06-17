import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { toast } from "sonner";
import { AlbumDetail, QueryParams, TrackDetail } from "@/types";

type AlbumQueryParams = QueryParams & {
  status?: string;
  type?: string;
  view?: string;
  artistId?: string;
  exclude?: string;
  sortBy?: "created_at" | "total_streams" | "title" | "release_date";
  sortDir?: "asc" | "desc";
};

export function useAlbums(params: AlbumQueryParams) {
  return useQuery({
    queryKey: ["albums", params],
    queryFn: async () => {
      const res = await apiClient.get("/albums", { params });
      return res.data as { data: AlbumDetail[]; meta?: any };
    },
  });
}

export function useTracksAlbum(albumId: string) {
  return useQuery({
    queryKey: ["tracks", "album-detail", albumId],
    queryFn: async () => {
      const res = await apiClient.get(`/albums/${albumId}/tracks`);

      return res.data as { data: TrackDetail[]; meta?: any };
    },
    enabled: !!albumId,
  });
}

export function useAlbumDetail(id: string) {
  return useQuery({
    queryKey: ["album", id],
    queryFn: async () => {
      const res = await apiClient.get(`/albums/${id}`);
      return res.data as { data: AlbumDetail };
    },
    enabled: !!id,
  });
}

export function useCreateAlbum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await apiClient.post("/albums", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["albums"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Có lỗi xảy ra khi tạo Album");
    },
  });
}

export function useUpdateAlbum(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await apiClient.patch(`/albums/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["albums"] });
      queryClient.invalidateQueries({ queryKey: ["album", id] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật");
    },
  });
}

export function useDeleteAlbum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`/albums/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["albums"] });
      toast.success("Đã xóa Album thành công!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Có lỗi xảy ra khi xóa Album");
    },
  });
}
