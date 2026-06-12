"use client";

import { useState } from "react";
import { toast } from "sonner";

import { PlaylistSearchInput } from "./playlist-search-input";
import { NewPlaylistButton } from "./new-playlist-button";
import { PlaylistList } from "./playlist-list";

import { useAuth } from "@/hooks/use-auth";
import {
  useAddTrackToPlaylist,
  useCreatePlaylist,
  usePlaylists,
} from "@/hooks/use-playlists";
import { useDebounce } from "@/hooks/use-debounce";

interface PlaylistSubmenuProps {
  trackId: string;
  addedPlaylistIds?: string[];
}

export function PlaylistSubmenu({
  trackId,
  addedPlaylistIds = [],
}: PlaylistSubmenuProps) {
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  const { user } = useAuth();

  const { data, isLoading } = usePlaylists({
    userId: user?.id,
    status: "all",
    limit: 50,
    search: debouncedSearch,
  });

  const playlists = data?.data ?? [];

  const { mutate: addTrack, isPending, variables } = useAddTrackToPlaylist();
  const { mutate: createPlaylist, isPending: isCreating } = useCreatePlaylist();

  const addingPlaylistId = isPending ? (variables?.playlistId ?? null) : null;

  const handleSelect = (playlistId: string) => {
    addTrack({ playlistId, trackId });
  };

  const handleCreatePlaylist = () => {
    createPlaylist(undefined, {
      onSuccess: (res) => {
        if (res?.data?.id) {
          addTrack({ playlistId: res.data.id, trackId });
          toast.success("Đã thêm bài hát vào playlist vừa tạo!");
        }
      },
    });
  };

  return (
    <div
      className="flex flex-col w-56 bg-card border border-border rounded-[0.5rem] shadow-2xl overflow-hidden"
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <PlaylistSearchInput value={search} onChange={setSearch} />

      <NewPlaylistButton onClick={handleCreatePlaylist} disabled={isCreating} />

      <PlaylistList
        playlists={playlists}
        isLoading={isLoading}
        addedPlaylistIds={addedPlaylistIds}
        addingId={addingPlaylistId}
        onSelect={handleSelect}
      />
    </div>
  );
}
