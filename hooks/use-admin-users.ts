import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { toast } from "sonner";

export function useAdminUsers(
  searchQuery: string = "",
  page: number = 1,
  limit: number = 10,
) {
  return useQuery({
    queryKey: ["admin-users", searchQuery, page, limit],
    queryFn: async () => {
      const res = await apiClient.get(
        `/admin/users?q=${searchQuery}&page=${page}&limit=${limit}`,
      );
      return res.data;
    },
  });
}

export function useToggleUserLock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isLocked }: { id: string; isLocked: boolean }) => {
      const res = await apiClient.post(`/admin/users/${id}/lock`, {
        isLocked,
      });
      return res.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success(
        variables.isLocked ? "Đã khóa tài khoản" : "Đã mở khóa tài khoản",
      );
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Lỗi thao tác");
    },
  });
}

export function useAdminArtists(
  searchQuery: string = "",
  page: number = 1,
  limit: number = 10,
) {
  return useQuery({
    queryKey: ["admin-artists", searchQuery, page, limit],
    queryFn: async () => {
      const res = await apiClient.get(
        `/admin/artists?q=${searchQuery}&page=${page}&limit=${limit}`,
      );
      return res.data;
    },
  });
}

export function useToggleArtistVerify() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      isVerified,
    }: {
      id: string;
      isVerified: boolean;
    }) => {
      const res = await apiClient.post(`/admin/artists/${id}/verify`, {
        isVerified,
      });
      return res.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-artists"] });
      toast.success(
        variables.isVerified
          ? "Đã cấp tích xanh thành công"
          : "Đã gỡ tích xanh",
      );
    },
    onError: (error: any) =>
      toast.error(error.response?.data?.error || "Lỗi thao tác"),
  });
}
