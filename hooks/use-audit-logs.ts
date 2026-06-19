import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";

export function useAuditLogs(actionFilter: string = "ALL") {
  return useQuery({
    queryKey: ["audit-logs", actionFilter],
    queryFn: async () => {
      const res = await apiClient.get(
        `/admin/audit-logs?action=${actionFilter}`,
      );
      return res.data.data;
    },
    staleTime: 60 * 1000,
  });
}
