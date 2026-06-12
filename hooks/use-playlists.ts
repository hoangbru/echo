import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { toast } from "sonner";
import { QueryParams } from "@/types";
import { Playlist, PlaylistDetail } from "@/types/playlist.type";

export type PlaylistQueryParams = QueryParams & {
  status?: "all" | "public" | "private";
  userId?: string;
};

export interface CreatePlaylistPayload {
  title?: string;
  description?: string | null;
  isPublic?: boolean;
}

export function usePlaylists(params: PlaylistQueryParams) {
  return useQuery({
    queryKey: ["playlists", params],
    queryFn: async () => {
      const res = await apiClient.get("/playlists", { params });
      return res.data as { data: Playlist[]; meta?: any };
    },
    staleTime: 60 * 1000,
  });
}

export function usePlaylistDetail(id: string) {
  return useQuery({
    queryKey: ["playlist", id],
    queryFn: async () => {
      const res = await apiClient.get(`/playlists/${id}`);
      return res.data.data as PlaylistDetail;
    },
    enabled: !!id,
  });
}

export function useCreatePlaylist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload?: CreatePlaylistPayload) => {
      const res = await apiClient.post("/playlists", payload || {});
      return res.data as { data: Playlist; message: string };
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
      toast.success(response.message || "Tạo playlist thành công!");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error ||
        error.message ||
        "Có lỗi xảy ra khi tạo playlist";
      toast.error(errorMessage);
    },
  });
}

export function useUpdatePlaylist(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await apiClient.patch(`/playlists/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data as { message: string };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
      queryClient.invalidateQueries({ queryKey: ["playlist", id] });
      toast.success("Cập nhật playlist thành công!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật playlist");
    },
  });
}

export function useDeletePlaylist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`/playlists/${id}`);
      return res.data as { message: string };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
      toast.success("Đã xóa playlist thành công!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Có lỗi xảy ra khi xóa playlist");
    },
  });
}

// ─── Playlist Track Hooks ─────────────────────────────────────────────────────

interface AddTrackToPlaylistInput {
  playlistId: string;
  trackId: string;
}

export function useAddTrackToPlaylist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ playlistId, trackId }: AddTrackToPlaylistInput) => {
      const res = await apiClient.post(`/playlists/${playlistId}/tracks`, {
        trackId,
      });
      return res.data as { message: string };
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["playlist", variables.playlistId],
      });
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
      toast.success("Đã thêm bài hát vào playlist!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Không thể thêm bài hát vào playlist");
    },
  });
}

export function useRemoveTrackFromPlaylist(playlistId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (trackId: string) => {
      const res = await apiClient.delete(`/playlists/${playlistId}/tracks`, {
        data: { trackId },
      });
      return res.data as { message: string };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlist", playlistId] });
      toast.success("Đã xóa bài hát khỏi playlist!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Không thể xóa bài hát khỏi playlist");
    },
  });
}

export function useReorderPlaylistTracks(playlistId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      tracks: Array<{ trackId: string; position: number }>,
    ) => {
      const res = await apiClient.patch(`/playlists/${playlistId}/tracks`, {
        tracks,
      });
      return res.data as { message: string };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlist", playlistId] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Không thể cập nhật thứ tự bài hát");
    },
  });
}
