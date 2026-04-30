import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { toast } from "sonner";
import { GenreFormValues } from "@/lib/validations/genre.schema";

export function useGenres(search: string = "") {
  return useQuery({
    queryKey: ["genres", search],
    queryFn: async () => {
      const res = await apiClient.get("/genres", { params: { search } });
      return res as { data: any[] };
    },
    staleTime: 1000 * 60 * 60,
  });
}

export function useCreateGenre() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await apiClient.post("/genres", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["genres"] });
    },
    onError: () => {
      toast.error("Có lỗi xảy ra khi tạo thể loại");
    },
  });
}
