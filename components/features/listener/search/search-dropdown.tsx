"use client";

import { useState, useEffect, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { SearchItemCard } from "./search-item-card";

import { usePlayer, PlayerTrack } from "@/hooks/use-player";
import { apiClient } from "@/lib/axios";
import type { SearchResults } from "@/types/search";
import {
  SearchItem,
  loadRecentSearches,
  saveRecentSearches,
} from "@/lib/utils/search-storage";
import { MAX_RECENT, RECENT_SEARCHES_KEY } from "@/constants/storage";

interface SearchDropdownProps {
  results: SearchResults | undefined;
  isLoading: boolean;
  onClose: () => void;
  searchTerm?: string;
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
        albumId: track.album?.id || track.albumId,
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

  if (isLoading) {
    return (
      <div className="absolute top-full mt-2 w-full bg-card border border-border rounded-lg shadow-2xl p-4 text-sm text-primary animate-pulse z-50">
        Đang tìm kiếm...
      </div>
    );
  }

  const isTyping = searchTerm.trim().length > 0;

  return (
    <div className="absolute top-full mt-2 w-full max-h-[480px] bg-card border border-border rounded-lg shadow-2xl overflow-y-auto z-50 py-2 custom-scrollbar">
      {!isTyping && (
        <div className="px-2">
          {recentSearches.length > 0 ? (
            <>
              <h3 className="px-3 py-2 text-sm font-bold text-foreground mb-1">
                Tìm kiếm gần đây
              </h3>
              {recentSearches.map((item) => (
                <SearchItemCard
                  key={`recent-${item.id}`}
                  item={item}
                  isRecent={true}
                  currentTrack={currentTrack}
                  isPlaying={isPlaying}
                  loadingPlayId={loadingPlayId}
                  onItemClick={handleItemClick}
                  onRemoveRecent={removeRecent}
                  onPlayClick={handlePlayClick}
                  onClose={onClose}
                />
              ))}
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
          {displayItems.map((item) => (
            <SearchItemCard
              key={`live-${item.id}`}
              item={item}
              isRecent={false}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              loadingPlayId={loadingPlayId}
              onItemClick={handleItemClick}
              onRemoveRecent={removeRecent}
              onPlayClick={handlePlayClick}
              onClose={onClose}
            />
          ))}
        </div>
      )}
    </div>
  );
}
