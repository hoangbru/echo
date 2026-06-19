import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";

export function useReports(statusFilter: "ALL" | "PENDING" | "RESOLVED") {
  return useQuery({
    queryKey: ["admin-reports", statusFilter],
    queryFn: async () => {
      const res = await apiClient.get(`/reports?status=${statusFilter}`);
      return res.data.data;
    },
  });
}

export function useResolveReport() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      reportId,
      action,
    }: {
      reportId: string;
      action: "APPROVE" | "REJECT";
    }) => {
      const res = await apiClient.patch(`/reports/${reportId}/resolve`, {
        action,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reports"] });
    },
  });

  return {
    resolveReport: mutation.mutateAsync,
    isResolving: mutation.isPending,
  };
}
