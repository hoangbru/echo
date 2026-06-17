"use client";

import { useRouter } from "next/navigation";
import { Music, Plus, Loader2 } from "lucide-react";

import { PlaylistDetailItem } from "./playlist-detail-item";
import { Button } from "@/components/ui/button";
import { RefreshButton } from "@/components/shared/buttons";

import { useCreatePlaylist, usePlaylists } from "@/hooks/use-playlists";

export const PlaylistGrid = () => {
  const router = useRouter();
  const { data: playlistsRes, isLoading, isError, refetch } = usePlaylists();
  const { mutate: createPlaylist, isPending: isCreating } = useCreatePlaylist();

  const playlists = playlistsRes?.data || [];

  const handleCreatePlaylist = () => {
    createPlaylist(undefined, {
      onSuccess: (response) => {
        const newPlaylistId = response.data.id;
        router.push(`/library/playlists/${newPlaylistId}`);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="p-4 bg-card border border-border rounded-[0.5rem] flex flex-col gap-4"
          >
            <div className="aspect-square bg-muted animate-pulse rounded-md" />
            <div className="h-5 w-3/4 bg-muted animate-pulse rounded-md" />
            <div className="h-4 w-1/2 bg-muted animate-pulse rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-destructive animate-in fade-in duration-500">
        <RefreshButton onRefresh={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700 slide-in-from-bottom-4">
      {playlists.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {playlists.map((playlist) => (
            <PlaylistDetailItem key={playlist.id} playlistId={playlist.id} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-card rounded-[0.5rem] border border-border shadow-sm">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Music className="w-12 h-12 text-muted-foreground/60" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-foreground">
            Chưa có danh sách phát nào
          </h2>
          <p className="text-muted-foreground mb-8 text-[15px]">
            Tạo danh sách phát đầu tiên để lưu trữ những giai điệu bạn yêu
            thích.
          </p>
          <Button
            onClick={handleCreatePlaylist}
            disabled={isCreating}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-6 rounded-[0.5rem] text-[16px] shadow-lg shadow-primary/20 hover:scale-105 transition-all"
          >
            {isCreating ? (
              <Loader2 className="w-6 h-6 mr-2 animate-spin" />
            ) : (
              <Plus className="w-6 h-6 mr-2" />
            )}
            Tạo Danh sách phát
          </Button>
        </div>
      )}
    </div>
  );
};