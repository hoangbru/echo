"use client";

import { Check, Loader2 } from "lucide-react";
import type { Playlist } from "@/types/playlist.type";

interface PlaylistListItemProps {
  playlist: Playlist;
  isAdded: boolean;
  isAdding: boolean;
  onClick: () => void;
}

export function PlaylistListItem({
  playlist,
  isAdded,
  isAdding,
  onClick,
}: PlaylistListItemProps) {
  return (
    <button
      onClick={onClick}
      disabled={isAdding}
      className="flex items-center justify-between w-full p-3 text-[14px] font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-60"
    >
      <span className="truncate text-left">{playlist.title}</span>
      <span className="shrink-0 ml-2">
        {isAdding ? (
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
        ) : isAdded ? (
          <Check className="w-4 h-4 text-primary" />
        ) : null}
      </span>
    </button>
  );
}
