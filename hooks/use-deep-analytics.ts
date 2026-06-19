import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";

export interface DeepAnalyticsResponse {
  hourlyStats: Array<{ hour: number; streams: number }>;
  genreStats: Array<{ genre: string; streams: number }>;
  trackPerformance: Array<{
    id: string;
    title: string;
    totalStreams: number;
    uniqueListeners: number;
    completionRate: number;
  }>;
}

export function useDeepAnalytics(userId: string | undefined) {
  return useQuery({
    queryKey: ["deep-analytics", userId],
    queryFn: async () => {
      const res = await apiClient.get(`/artists/${userId}/analytics?by=userId`);
      return res.data.data as DeepAnalyticsResponse;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}
