import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { ArtistRequestFormValues } from "@/lib/validations/artist-request.schema";
import { QueryParams } from "@/types";
import { toast } from "sonner";

type ArtistRequestsQueryParams = QueryParams & {
  status: string;
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
    mutationFn: async (data: ArtistRequestFormValues) => {
      const res = await apiClient.post("/artist-request", data);
      return res;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["artist-request"] });
    },
    onError() {
      toast.error("Đã có lỗi xảy ra", { description: "Vui lòng thử lại sau!" });
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
