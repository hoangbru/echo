"use client";

import { Fragment } from "react";
import { useRouter } from "next/navigation";
import { Music, Plus, Loader2 } from "lucide-react";

import { PlaylistDetailItem } from "./playlist-detail-item";
import { Button } from "@/components/ui/button";
import { RefreshButton } from "@/components/shared/buttons";

import { useCreatePlaylist, usePlaylists } from "@/hooks/use-playlists";

export const PlaylistGrid = () => {
  const router = useRouter();
  const { data: playlistsRes, isLoading, isError, refetch } = usePlaylists({});
  const { mutate: createPlaylist, isPending: isCreating } = useCreatePlaylist();

  const playlists = playlistsRes?.data || [];

  const handleCreatePlaylist = () => {
    const defaultTitle = `Danh sách phát của tôi #${playlists.length + 1}`;

    const formData = new FormData();
    formData.append("title", defaultTitle);

    createPlaylist(formData, {
      onSuccess: (response) => {
        const newPlaylistId = response.data.id;
        router.push(`/playlists/${newPlaylistId}`);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="p-4 bg-card border border-border rounded-2xl flex flex-col gap-4"
            >
              <div className="aspect-square bg-secondary animate-pulse rounded-xl"></div>
              <div className="h-5 w-3/4 bg-secondary animate-pulse rounded-lg"></div>
              <div className="h-4 w-1/2 bg-secondary animate-pulse rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background p-8 flex flex-col items-center justify-center text-destructive">
        <RefreshButton onRefresh={() => refetch()} />
      </div>
    );
  }

  return (
    <Fragment>
      {playlists.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {playlists.map((playlist) => (
            <PlaylistDetailItem key={playlist.id} playlistId={playlist.id} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-card rounded-2xl border border-border shadow-sm">
          <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
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
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-6 rounded-full text-[16px] shadow-lg shadow-primary/20 hover:scale-105 transition-all"
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
    </Fragment>
  );
};
