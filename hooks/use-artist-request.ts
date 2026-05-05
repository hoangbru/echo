import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { QueryParams } from "@/types";
import { toast } from "sonner";

type ArtistRequestsQueryParams = QueryParams & {
  status?: string;
  sortBy?: string;
  sortOrder?: string;
  fromDate?: string;
  toDate?: string;
};

export function useArtistRequests(params: ArtistRequestsQueryParams) {
  return useQuery({
    queryKey: ["artist-request", params],
    queryFn: async () => {
      const res = await apiClient.get("/artist-request", { params });
      return res as { data: any[]; meta?: any };
    },
  });
}

export const useSubmitArtistRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await apiClient.post("/artist-request", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["artist-request"] });
    },
    onError(error: any) {
      toast.error(error.message || "Đã có lỗi khi gửi yêu cầu");
    },
  });
};

export function useUpdateArtistRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const res = await apiClient.patch(`/artist-request`, data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artist-request"] });
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
}
