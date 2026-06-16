import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { toast } from "sonner";

export function useFollowArtist(artistId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["follow-status", artistId];

  // 1. Query lấy trạng thái follow ban đầu
  const { data: isFollowing = false, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await apiClient.get(`/artists/${artistId}/follow`);
      return res.data.isFollowing;
    },
    enabled: !!artistId,
  });

  // 2. Mutation để Toggle Follow (Có Optimistic Update)
  const toggleFollow = useMutation({
    mutationFn: async () => {
      const res = await apiClient.post(`/artists/${artistId}/follow`);
      return res.data;
    },
    // Chạy NGAY LẬP TỨC khi user click
    onMutate: async () => {
      // Huỷ các request GET đang chạy để tránh đụng độ
      await queryClient.cancelQueries({ queryKey });

      // Lưu lại trạng thái cũ để phòng hờ bị lỗi
      const previousStatus = queryClient.getQueryData<boolean>(queryKey);

      // Cập nhật State lạc quan (Optimistic Update)
      queryClient.setQueryData<boolean>(queryKey, (old) => !old);

      return { previousStatus };
    },
    // Nếu API lỗi -> Rollback lại như cũ
    onError: (err, variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousStatus);
      toast.error("Không thể thực hiện. Vui lòng thử lại sau.");
    },
    // Khi API chạy xong thành công hay thất bại -> Lấy lại data chuẩn từ server
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    isFollowing,
    isLoading,
    toggleFollow: () => toggleFollow.mutate(),
  };
}
