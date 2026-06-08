"use client";

import { useState, useEffect, MouseEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Music, Mic2, Disc, Plus, X, Play, Pause, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { usePlayer, PlayerTrack } from "@/hooks/use-player";
import { apiClient } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { DropdownTrackMenu } from "../../player";
import type { SearchResults } from "@/types/search";

interface SearchItem {
  id: string;
  type: "track" | "artist" | "album";
  title: string;
  subtitle: string;
  image: string | null;
  path: string;
  raw?: any;
}

interface SearchDropdownProps {
  results: SearchResults | undefined;
  isLoading: boolean;
  onClose: () => void;
  searchTerm?: string;
}

const RECENT_SEARCHES_KEY = "music_recent_searches";
const MAX_RECENT = 5;

function loadRecentSearches(): SearchItem[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
    return saved ? (JSON.parse(saved) as SearchItem[]) : [];
  } catch {
    return [];
  }
}

function saveRecentSearches(items: SearchItem[]): void {
  try {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(items));
  } catch {
    // Quota exceeded or private browsing — fail silently
  }
}

export function addToRecentSearches(item: SearchItem): void {
  const recents = loadRecentSearches();
  const next = [item, ...recents.filter((r) => r.id !== item.id)].slice(
    0,
    MAX_RECENT,
  );
  saveRecentSearches(next);
}

export function SearchDropdown({
  results,
  isLoading,
  onClose,
  searchTerm = "",
}: SearchDropdownProps) {
  const router = useRouter();
  const { playTrack, currentTrack, activeContextId, isPlaying, togglePlay } =
    usePlayer();

  const [recentSearches, setRecentSearches] = useState<SearchItem[]>([]);
  const [loadingPlayId, setLoadingPlayId] = useState<string | null>(null);

  useEffect(() => {
    setRecentSearches(loadRecentSearches());
  }, []);

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === RECENT_SEARCHES_KEY) {
        setRecentSearches(loadRecentSearches());
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const persistRecent = (item: SearchItem) => {
    const next = [
      item,
      ...recentSearches.filter((r) => r.id !== item.id),
    ].slice(0, MAX_RECENT);
    setRecentSearches(next);
    saveRecentSearches(next);
  };

  const handleItemClick = (item: SearchItem) => {
    persistRecent(item);
    router.push(item.path);
    onClose();
  };

  const removeRecent = (e: MouseEvent, id: string) => {
    e.stopPropagation();
    const next = recentSearches.filter((r) => r.id !== id);
    setRecentSearches(next);
    saveRecentSearches(next);
  };

  const handlePlayClick = async (e: MouseEvent, item: SearchItem) => {
    e.stopPropagation();

    const isThisTrackPlaying =
      item.type === "track" && activeContextId === item.id;
    const isThisAlbumPlaying =
      item.type === "album" && activeContextId === item.id;

    if (isThisTrackPlaying || isThisAlbumPlaying) {
      togglePlay();
      return;
    }

    persistRecent(item);

    if (item.type === "track") {
      const track = item.raw;
      const playerTrack: PlayerTrack = {
        id: track.id,
        title: track.title,
        lyrics: track.lyrics || "",
        artistNames:
          track.artists?.map((a: any) => a.stageName).join(", ") ||
          "Unknown Artist",
        imageUrl: track.imageUrl || "/default-cover.jpg",
        audioUrl: track.audioUrl,
        albumId: track.album?.id,
      };
      playTrack(playerTrack, [playerTrack], track.id);
    } else if (item.type === "album") {
      try {
        setLoadingPlayId(item.id);
        const response = await apiClient.get(`/albums/${item.id}/tracks`);
        const tracksData = response.data;

        if (!tracksData || tracksData.length === 0) {
          toast.info("Album trống", {
            description: "Album này hiện chưa có bài hát nào.",
          });
          return;
        }

        const queue: PlayerTrack[] = tracksData.map((t: any) => ({
          id: t.id,
          title: t.title,
          lyrics: t.lyrics || "",
          artistNames:
            t.artists?.map((a: any) => a.stageName).join(", ") || item.subtitle,
          imageUrl: t.imageUrl || item.image || "/default-cover.jpg",
          audioUrl: t.audioUrl,
          albumId: item.id,
        }));

        playTrack(queue[0], queue, item.id);
      } catch (error) {
        console.error(error);
        toast.error("Lỗi", {
          description: "Không thể tải bài hát của album này.",
        });
      } finally {
        setLoadingPlayId(null);
      }
    }
  };

  const displayItems: SearchItem[] = [];
  if (results?.tracks && results.tracks.length > 0) {
    displayItems.push(
      ...results.tracks.map((t: any) => ({
        id: t.id,
        type: "track" as const,
        title: t.title,
        subtitle: `Song • ${t.artists?.map((a: any) => a.stageName).join(", ")}`,
        image: t.imageUrl,
        path: `/track/${t.id}`,
        raw: t,
      })),
    );
  }
  if (results?.albums && results.albums.length > 0) {
    displayItems.push(
      ...results.albums.map((a: any) => ({
        id: a.id,
        type: "album" as const,
        title: a.title,
        subtitle: `Album • ${a.artist?.stageName || "Unknown Artist"}`,
        image: a.coverImage,
        path: `/album/${a.id}`,
        raw: a,
      })),
    );
  }
  if (results?.artists && results.artists.length > 0) {
    displayItems.push(
      ...results.artists.map((a: any) => ({
        id: a.id,
        type: "artist" as const,
        title: a.stageName,
        subtitle: "Artist",
        image: a.profileImage,
        path: `/artist/${a.id}`,
        raw: a,
      })),
    );
  }

  const renderClickableArtists = (item: SearchItem) => {
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

  const renderItem = (item: SearchItem, isRecent: boolean = false) => {
    const isThisTrackPlaying =
      item.type === "track" && currentTrack?.id === item.id;
    const isThisAlbumPlaying =
      item.type === "album" && currentTrack?.albumId === item.id;
    const isThisPlaying = isThisTrackPlaying || isThisAlbumPlaying;
    const showPauseIcon = isThisPlaying && isPlaying;

    return (
      <div
        key={`${isRecent ? "recent" : "live"}-${item.id}`}
        onClick={() => handleItemClick(item)}
        role="button"
        className="w-full flex items-center justify-between px-3 py-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-all text-left group cursor-pointer"
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div
            className={`w-10 h-10 bg-secondary relative flex-shrink-0 transition-all ${item.type === "artist" ? "rounded-full" : "rounded"}`}
          >
            {item.image ? (
              <Image
                src={item.image}
                alt={item.title}
                fill
                className={`object-cover ${item.type === "artist" ? "rounded-full" : "rounded"}`}
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
                className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity rounded ${isThisPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
              >
                <Button
                  variant={"ghost"}
                  onClick={(e) => handlePlayClick(e, item)}
                  disabled={loadingPlayId === item.id}
                  className="w-8 h-8 hover:scale-105 transition-transform rounded-full flex items-center justify-center text-white shadow-lg disabled:opacity-50"
                >
                  {loadingPlayId === item.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : showPauseIcon ? (
                    <Pause className="w-4 h-4 fill-white" />
                  ) : (
                    <Play className="w-4 h-4 fill-white translate-x-[1px]" />
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
              {renderClickableArtists(item)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
          {isRecent ? (
            <div
              onClick={(e) => removeRecent(e, item.id)}
              className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </div>
          ) : (
            <>
              <DropdownTrackMenu />
              {item.type === "track" && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 hover:text-foreground text-muted-foreground transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="absolute top-full mt-2 w-full bg-popover border border-border rounded-lg shadow-2xl p-4 text-sm text-primary animate-pulse z-50">
        Đang tìm kiếm...
      </div>
    );
  }

  const isTyping = searchTerm.trim().length > 0;

  return (
    <div className="absolute top-full mt-2 w-full max-h-[480px] bg-popover border border-border rounded-lg shadow-2xl overflow-y-auto z-50 py-2 custom-scrollbar">
      {!isTyping && (
        <div className="px-2">
          {recentSearches.length > 0 ? (
            <>
              <h3 className="px-3 py-2 text-sm font-bold text-foreground mb-1">
                Tìm kiếm gần đây
              </h3>
              {recentSearches.map((item) => renderItem(item, true))}
            </>
          ) : (
            <div className="p-4 text-sm text-muted-foreground text-center">
              Hãy nhập từ khóa để tìm kiếm...
            </div>
          )}
        </div>
      )}
      {isTyping && displayItems.length === 0 && (
        <div className="p-4 text-sm text-muted-foreground text-center">
          Không tìm thấy kết quả nào cho &ldquo;{searchTerm}&rdquo;
        </div>
      )}
      {isTyping && displayItems.length > 0 && (
        <div className="px-2">
          {displayItems.map((item) => renderItem(item, false))}
        </div>
      )}
    </div>
  );
}
