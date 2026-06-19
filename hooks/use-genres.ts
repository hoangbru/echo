import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { toast } from "sonner";

export const useGenres = (params?: { q?: string }) => {
  return useQuery({
    queryKey: ["genres", params],
    queryFn: async () => {
      const res = await apiClient.get("/genres", { params });

      return res.data;
    },
  });
};

interface CreateGenrePayload {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}

export function useCreateAdminGenre() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateGenrePayload) => {
      const res = await apiClient.post("/admin/genres", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["genres"] });
      toast.success("Đã thêm thể loại nhạc mới thành công");
    },
    onError: (error: any) => {
      const errorMsg =
        error.response?.data?.error || "Có lỗi xảy ra khi tạo thể loại";
      toast.error(errorMsg);
    },
  });
}
