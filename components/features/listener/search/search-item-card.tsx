"use client";

import { MouseEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Music, Mic2, Disc, Plus, X, Play, Pause, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DropdownTrackMenu } from "@/components/shared";

import type { PlayerTrack } from "@/hooks/use-player";
import { SearchItem } from "@/lib/utils/search-storage";

interface SearchItemCardProps {
  item: SearchItem;
  isRecent?: boolean;
  currentTrack: PlayerTrack | null;
  isPlaying: boolean;
  loadingPlayId: string | null;
  onItemClick: (item: SearchItem) => void;
  onRemoveRecent: (e: MouseEvent, id: string) => void;
  onPlayClick: (e: MouseEvent, item: SearchItem) => void;
  onClose: () => void;
}

export function SearchItemCard({
  item,
  isRecent = false,
  currentTrack,
  isPlaying,
  loadingPlayId,
  onItemClick,
  onRemoveRecent,
  onPlayClick,
  onClose,
}: SearchItemCardProps) {
  const router = useRouter();
  const isThisTrackPlaying =
    item.type === "track" && currentTrack?.id === item.id;
  const isThisAlbumPlaying =
    item.type === "album" && currentTrack?.albumId === item.id;
  const isThisPlaying = isThisTrackPlaying || isThisAlbumPlaying;
  const showPauseIcon = isThisPlaying && isPlaying;

  const renderClickableArtists = () => {
    if (!item.raw) return <span className="truncate">{item.subtitle}</span>;

    if (item.type === "track") {
      return (
        <div className="truncate text-muted-foreground">
          <span>Song • </span>
          {item.raw.artists?.map((artist: any, index: number, arr: any[]) => (
            <span key={artist.id}>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/artist/${artist.id}`);
                  onClose();
                }}
                className="hover:underline hover:text-foreground cursor-pointer transition-colors"
              >
                {artist.stageName}
              </span>
              {index < arr.length - 1 && ", "}
            </span>
          ))}
        </div>
      );
    }

    if (item.type === "album") {
      return (
        <div className="truncate text-muted-foreground">
          <span>Album • </span>
          <span
            onClick={(e) => {
              e.stopPropagation();
              if (item.raw.artist?.id) {
                router.push(`/artist/${item.raw.artist.id}`);
                onClose();
              }
            }}
            className="hover:underline hover:text-foreground cursor-pointer transition-colors"
          >
            {item.raw.artist?.stageName || "Unknown Artist"}
          </span>
        </div>
      );
    }

    return <span className="text-muted-foreground">Artist</span>;
  };

  return (
    <div
      onClick={() => onItemClick(item)}
      role="button"
      className="w-full flex items-center justify-between px-3 py-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-all text-left group cursor-pointer"
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <div
          className={`w-10 h-10 bg-sidebar-background relative flex-shrink-0 transition-all ${
            item.type === "artist" ? "rounded-full" : "rounded-[4px]"
          }`}
        >
          {item.image ? (
            <Image
              src={item.image}
              alt={item.title}
              fill
              className={`object-cover ${
                item.type === "artist" ? "rounded-full" : "rounded-[4px]"
              }`}
            />
          ) : item.type === "artist" ? (
            <Mic2 className="w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-muted-foreground" />
          ) : item.type === "album" ? (
            <Disc className="w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-muted-foreground" />
          ) : (
            <Music className="w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-muted-foreground" />
          )}

          {item.type !== "artist" && (
            <div
              className={`absolute inset-0 bg-background/50 flex items-center justify-center transition-opacity rounded-[4px] ${
                isThisPlaying
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100"
              }`}
            >
              <Button
                variant={"ghost"}
                onClick={(e) => onPlayClick(e, item)}
                disabled={loadingPlayId === item.id}
                className="w-8 h-8 hover:scale-105 transition-transform rounded-full flex items-center justify-center text-primary-foreground shadow-lg disabled:opacity-50"
              >
                {loadingPlayId === item.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : showPauseIcon ? (
                  <Pause className="w-4 h-4 fill-primary-foreground" />
                ) : (
                  <Play className="w-4 h-4 fill-primary-foreground translate-x-[1px]" />
                )}
              </Button>
            </div>
          )}
        </div>

        <div className="flex flex-col overflow-hidden max-w-[200px] sm:max-w-[280px]">
          <span
            className={
              isThisPlaying
                ? "text-sm font-medium text-primary truncate"
                : "text-sm font-medium text-foreground truncate group-hover:underline decoration-foreground underline-offset-2"
            }
          >
            {item.title}
          </span>
          <div className="text-xs truncate mt-0.5">
            {renderClickableArtists()}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
        {isRecent ? (
          <div
            onClick={(e) => onRemoveRecent(e, item.id)}
            className="p-2 hover:bg-border rounded-full text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </div>
        ) : (
          item.type === "track" && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="p-2 hover:text-foreground text-muted-foreground transition-colors"
            >
              <DropdownTrackMenu track={item} />
            </div>
          )
        )}
      </div>
    </div>
  );
}
