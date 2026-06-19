import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";

export function useAdminAnalytics() {
  return useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const res = await apiClient.get("/admin/analytics");
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useAdminBadges() {
  return useQuery({
    queryKey: ["admin-badges"],
    queryFn: async () => {
      const res = await apiClient.get("/admin/badges");
      return res.data;
    },
    refetchInterval: 60 * 1000,
  });
}
