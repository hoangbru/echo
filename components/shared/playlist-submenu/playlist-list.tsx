"use client";

import { Loader2 } from "lucide-react";
import type { Playlist } from "@/types/playlist.type";
import { PlaylistListItem } from "./playlist-list-item";

interface PlaylistListProps {
  playlists: Playlist[];
  isLoading: boolean;
  addedPlaylistIds: string[];
  addingId: string | null;
  onSelect: (playlistId: string) => void;
}

export function PlaylistList({
  playlists,
  isLoading,
  addedPlaylistIds,
  addingId,
  onSelect,
}: PlaylistListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
      </div>
    );
  }

  if (playlists.length === 0) {
    return (
      <p className="text-xs text-gray-500 text-center py-4 px-3">
        Không tìm thấy playlist
      </p>
    );
  }

  return (
    <div className="overflow-y-auto max-h-[180px] custom-scrollbar py-1">
      {playlists.map((pl) => (
        <PlaylistListItem
          key={pl.id}
          playlist={pl}
          isAdded={addedPlaylistIds.includes(pl.id)}
          isAdding={addingId === pl.id}
          onClick={() => onSelect(pl.id)}
        />
      ))}
    </div>
  );
}