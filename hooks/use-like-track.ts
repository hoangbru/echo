"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { toast } from "sonner";
import { useAuth } from "./use-auth";

export function useLikeTrack(trackId: string) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const queryKey = ["track-like", trackId];

  const { data, isLoading: isQueryLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!user) return { isLiked: false };
      const res = await apiClient.get(`/tracks/${trackId}/like`);
      return res.data as { isLiked: boolean };
    },
    enabled: !!trackId && !!user,
    staleTime: 5 * 60 * 1000,
  });

  const isLiked = data?.isLiked ?? false;

  const mutation = useMutation({
    mutationFn: async (currentlyLiked: boolean) => {
      if (currentlyLiked) {
        await apiClient.delete(`/tracks/${trackId}/like`);
      } else {
        await apiClient.post(`/tracks/${trackId}/like`);
      }
    },
    onMutate: async (currentlyLiked) => {
      await queryClient.cancelQueries({ queryKey });
      const previousState = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, { isLiked: !currentlyLiked });

      return { previousState };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(queryKey, context?.previousState);
      toast.error("Không thể thực hiện tác vụ này. Vui lòng thử lại!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ["liked-tracks"] });
    },
  });

  const toggleLike = () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để thả tim bài hát!");
      return;
    }
    mutation.mutate(isLiked);
  };

  return {
    isLiked,
    toggleLike,
    isLoading: isQueryLoading || mutation.isPending,
  };
}
