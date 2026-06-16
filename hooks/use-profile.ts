import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { toast } from "sonner";
import { UserProfile } from "@/types";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await apiClient.get("/users/profile");
      return res.data.data as UserProfile;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateProfile(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await apiClient.patch(`/users/profile/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["user", id] });

      toast.success(data?.message || "Cập nhật hồ sơ thành công!");
    },
    onError: (error: any) => {
      const errorMsg =
        error.response?.data?.error ||
        error.message ||
        "Có lỗi xảy ra khi cập nhật hồ sơ";
      toast.error(errorMsg);
    },
  });
}

export function useDeactivateAccount(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (isLocked: boolean) => {
      const res = await apiClient.post(`/users/profile/${id}/lock`, {
        isLocked,
      });
      return res.data;
    },
    onSuccess: (data, isLocked) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });

      toast.success(
        isLocked
          ? "Tài khoản của bạn đã được vô hiệu hóa"
          : "Tài khoản đã được mở khóa thành công",
      );
    },
    onError: (error: any) => {
      const errorMsg =
        error.response?.data?.error ||
        error.message ||
        "Có lỗi xảy ra khi thay đổi trạng thái tài khoản";
      toast.error(errorMsg);
    },
  });
}

export function useFollowedArtists() {
  return useQuery({
    queryKey: ["followed-artists"],
    queryFn: async () => {
      const res = await apiClient.get("/users/following");
      return res.data.data;
    },
  });
}
