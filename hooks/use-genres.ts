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

export function useCreateGenre() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await apiClient.post("/genres", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["genres"] });
    },
    onError: () => {
      toast.error("Có lỗi xảy ra khi tạo thể loại");
    },
  });
}
