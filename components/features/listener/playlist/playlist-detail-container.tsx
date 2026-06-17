"use client";

import { useState } from "react";
import { Pause, Play, Edit2 } from "lucide-react";

import { PlaylistTrackList } from "./playlist-track-list";
import { PlaylistHeroSection } from "./playlist-hero-section";
import { PlaylistEditModal } from "./playlist-edit-modal";
import { PlaylistSearchBar } from "./playlist-search-bar";
import { ConfirmModal } from "@/components/shared/modals";

import {
  usePlaylistDetail,
  useRemoveTrackFromPlaylist,
} from "@/hooks/use-playlists";
import { PlayerTrack, usePlayer } from "@/hooks/use-player";

interface PlaylistDetailContainer {
  playlistId: string;
}

export const PlaylistDetailContainer = ({
  playlistId,
}: PlaylistDetailContainer) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [trackToDelete, setTrackToDelete] = useState<string | null>(null);

  const {
    data: playlistRes,
    isLoading: isLoadingDetail,
    refetch: refetchDetail,
  } = usePlaylistDetail(playlistId);
  
  const { mutateAsync: removeTrack, isPending: isRemoving } =
    useRemoveTrackFromPlaylist(playlistId);

  const tracks = playlistRes?.tracks || [];
  const playlist = playlistRes || undefined;

  const { playTrack, togglePlay, activeContextId, isPlaying } = usePlayer();
  const isThisPlaylistPlaying = activeContextId === playlistId && isPlaying;

  const handlePlayPlaylist = () => {
    if (!tracks || tracks.length === 0) return;

    if (isThisPlaylistPlaying) {
      togglePlay();
      return;
    }

    const queue: PlayerTrack[] = tracks.map((t) => ({
      id: t.id,
      title: t.title,
      lyrics: t.lyrics || "",
      artistNames:
        t.artists?.map((ta: any) => ta.stageName).join(", ") ||
        "Unknown Artist",
      imageUrl: t.imageUrl || playlist?.coverImage || "/default-cover.jpg",
      audioUrl: t.audioUrl,
      albumId: t.album?.id || t.albumId || "",
      playlistId: playlistId,
    }));

    playTrack(queue[0], queue, playlistId);
  };

  const handleConfirmDeleteTrack = async () => {
    if (!trackToDelete) return;
    try {
      await removeTrack(trackToDelete);
      setTrackToDelete(null);
      refetchDetail();
    } catch (error) {
      console.error("Lỗi khi xóa bài hát khỏi danh sách phát:", error);
    }
  };

  if (isLoadingDetail) {
    return (
      <div className="text-muted-foreground p-6">
        Đang tải danh sách phát...
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* --- HERO SECTION --- */}
      {playlist && (
        <div
          className="relative group cursor-pointer"
          onClick={() => setIsEditModalOpen(true)}
        >
          <PlaylistHeroSection playlist={playlist} />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <span className="flex items-center gap-2 font-semibold text-[16px] text-white">
              <Edit2 className="w-5 h-5" /> Chỉnh sửa thông tin chi tiết
            </span>
          </div>
        </div>
      )}

      {/* --- CONTENT SECTION --- */}
      <div className="px-6 bg-gradient-to-b from-secondary/50 to-background min-h-screen pt-4">
        <div className="pb-8">
          {/* --- ACTION BAR --- */}
          <div className="flex items-center gap-6 py-6">
            <button
              onClick={handlePlayPlaylist}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-transform shadow-lg ${
                tracks.length > 0
                  ? "bg-primary hover:scale-105 shadow-primary/30 cursor-pointer"
                  : "bg-primary/50 cursor-not-allowed opacity-50"
              }`}
              disabled={tracks.length === 0}
            >
              {isThisPlaylistPlaying ? (
                <Pause className="w-6 h-6 text-primary-foreground fill-primary-foreground" />
              ) : (
                <Play className="w-6 h-6 text-primary-foreground fill-primary-foreground ml-1" />
              )}
            </button>

            <button
              className="text-muted-foreground hover:text-foreground hover:scale-110 transition-all"
              onClick={() => setIsEditModalOpen(true)}
            >
              <Edit2 className="w-6 h-6" />
            </button>
          </div>

          {playlist && tracks.length > 0 && (
            <PlaylistTrackList
              playlist={playlist}
              tracks={tracks}
              onDeleteTrack={(trackId: string) => setTrackToDelete(trackId)}
            />
          )}

          <PlaylistSearchBar
            playlistId={playlistId}
            existingTrackIds={tracks.map((t) => t.id)}
          />
        </div>
      </div>

      {/* --- MODALS --- */}
      {playlist && (
        <PlaylistEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          playlist={playlist}
          onSuccess={refetchDetail}
        />
      )}

      <ConfirmModal
        isOpen={trackToDelete !== null}
        onClose={() => setTrackToDelete(null)}
        onConfirm={handleConfirmDeleteTrack}
        title="Xóa khỏi Danh sách phát?"
        description={
          <>
            Bài hát này sẽ bị xóa khỏi{" "}
            <span className="text-white font-bold">{playlist?.title}</span>. Bạn
            vẫn có thể tìm thấy bài hát này trong các album hoặc danh sách phát
            khác.
          </>
        }
        confirmText="Xóa"
        cancelText="Hủy"
        isProcessing={isRemoving}
      />
    </div>
  );
};
