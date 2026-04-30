import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { toast } from "sonner";
import { QueryParams } from "@/types";

type AlbumQueryParams = QueryParams & {
  status: string;
  genre: string;
  view: string;
};

export function useAlbums(params: AlbumQueryParams) {
  return useQuery({
    queryKey: ["albums", params],
    queryFn: async () => {
      const res = await apiClient.get("/albums", { params });
      return res as { data: any[]; meta?: any };
    },
  });
}

export function useAlbumDetail(id: string) {
  return useQuery({
    queryKey: ["album", id],
    queryFn: async () => {
      const res = await apiClient.get(`/albums/${id}`);
      return res as { data: any };
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
      return res;
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
      return res;
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
      return res;
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
