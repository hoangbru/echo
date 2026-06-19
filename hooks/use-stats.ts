import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";

export interface ArtistStatsResponse {
  overview: {
    totalStreams: number;
    totalFollowers: number;
    totalTracks: number;
    totalAlbums: number;
    monthlyListeners: number;
    completionRate: number;
  };
  chartData: Array<{ date: string; streams: number }>;
  topTracks: Array<{
    id: string;
    title: string;
    totalStreams: number;
    imageUrl: string | null;
  }>;
}

export function useArtistStats(userId: string | undefined, days: number = 30) {
  return useQuery({
    queryKey: ["artist-stats", userId, days],
    queryFn: async () => {
      const res = await apiClient.get(
        `/artists/${userId}/stats?by=userId&timeRange=${days}`,
      );
      return res.data.data as ArtistStatsResponse;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}
