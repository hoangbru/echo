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

interface SearchItem {
  id: string;
  type: "track" | "artist" | "album";
  title: string;
  subtitle: string;
  image: string | null;
  path: string;
  raw?: any;
}

export function SearchDropdown({
  results,
  isLoading,
  onClose,
  searchTerm = "",
}: any) {
  const router = useRouter();

  const { playTrack, currentTrack, activeContextId, isPlaying, togglePlay } =
    usePlayer();

  const [recentSearches, setRecentSearches] = useState<SearchItem[]>([]);
  const [loadingPlayId, setLoadingPlayId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("music_recent_searches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error("Lỗi parse lịch sử:", e);
      }
    }
  }, []);

  const handleItemClick = (item: SearchItem) => {
    const newRecents = [
      item,
      ...recentSearches.filter((r) => r.id !== item.id),
    ].slice(0, 5);
    setRecentSearches(newRecents);
    localStorage.setItem("music_recent_searches", JSON.stringify(newRecents));
    router.push(item.path);
    onClose();
  };

  const removeRecent = (e: MouseEvent, id: string) => {
    e.stopPropagation();
    const newRecents = recentSearches.filter((r) => r.id !== id);
    setRecentSearches(newRecents);
    localStorage.setItem("music_recent_searches", JSON.stringify(newRecents));
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

  const renderClickableArtists = (item: SearchItem) => {
    if (!item.raw) return <span className="truncate">{item.subtitle}</span>;

    if (item.type === "track") {
      return (
        <div className="truncate">
          <span>Song • </span>
          {item.raw.artists?.map((artist: any, index: number, arr: any[]) => (
            <span key={artist.id}>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/artist/${artist.id}`);
                  onClose();
                }}
                className="hover:underline hover:text-white cursor-pointer transition-colors"
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
        <div className="truncate">
          <span>Album • </span>
          <span
            onClick={(e) => {
              e.stopPropagation();
              if (item.raw.artist?.id) {
                router.push(`/artist/${item.raw.artist.id}`);
                onClose();
              }
            }}
            className="hover:underline hover:text-white cursor-pointer transition-colors"
          >
            {item.raw.artist?.stageName || "Unknown Artist"}
          </span>
        </div>
      );
    }

    return <span>Artist</span>;
  };

  const displayItems: SearchItem[] = [];
  if (results?.tracks?.length > 0) {
    displayItems.push(
      ...results.tracks.map((t: any) => ({
        id: t.id,
        type: "track",
        title: t.title,
        subtitle: `Song • ${t.artists?.map((a: any) => a.stageName).join(", ")}`,
        image: t.imageUrl,
        path: `/track/${t.id}`,
        raw: t,
      })),
    );
  }
  if (results?.albums?.length > 0) {
    displayItems.push(
      ...results.albums.map((a: any) => ({
        id: a.id,
        type: "album",
        title: a.title,
        subtitle: `Album • ${a.artist?.stageName || "Unknown Artist"}`,
        image: a.coverImage,
        path: `/album/${a.id}`,
        raw: a,
      })),
    );
  }
  if (results?.artists?.length > 0) {
    displayItems.push(
      ...results.artists.map((a: any) => ({
        id: a.id,
        type: "artist",
        title: a.stageName,
        subtitle: "Artist",
        image: a.profileImage,
        path: `/artist/${a.id}`,
        raw: a,
      })),
    );
  }

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
        className="w-full flex items-center justify-between px-3 py-2 hover:bg-white/10 rounded-md transition-all text-left group cursor-pointer"
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div
            className={`w-10 h-10 bg-[#282828] relative flex-shrink-0 transition-all ${item.type === "artist" ? "rounded-full" : "rounded"}`}
          >
            {item.image ? (
              <Image
                src={item.image}
                alt={item.title}
                fill
                className={`object-cover ${item.type === "artist" ? "rounded-full" : "rounded"}`}
              />
            ) : item.type === "artist" ? (
              <Mic2 className="w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-500" />
            ) : item.type === "album" ? (
              <Disc className="w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-500" />
            ) : (
              <Music className="w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-500" />
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
                  : "text-sm font-medium text-white truncate group-hover:underline decoration-white underline-offset-2"
              }
            >
              {item.title}
            </span>
            <div className="text-xs text-gray-400 truncate mt-0.5">
              {renderClickableArtists(item)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
          {isRecent ? (
            <div
              onClick={(e) => removeRecent(e, item.id)}
              className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </div>
          ) : (
            <>
              <DropdownTrackMenu />
              {item.type === "track" && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 hover:text-white text-gray-400 transition-colors"
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
      <div className="absolute top-full mt-2 w-full bg-[#181818] border border-white/10 rounded-lg shadow-2xl p-4 text-sm text-primary animate-pulse z-50">
        Đang tìm kiếm...
      </div>
    );
  }

  const isTyping = searchTerm.trim().length > 0;

  return (
    <div className="absolute top-full mt-2 w-full max-h-[480px] bg-[#181818] border border-white/10 rounded-lg shadow-2xl overflow-y-auto z-50 py-2 custom-scrollbar">
      {!isTyping && (
        <div className="px-2">
          {recentSearches.length > 0 ? (
            <>
              <h3 className="px-3 py-2 text-sm font-bold text-white mb-1">
                Tìm kiếm gần đây
              </h3>
              {recentSearches.map((item) => renderItem(item, true))}
            </>
          ) : (
            <div className="p-4 text-sm text-gray-400 text-center">
              Hãy nhập từ khóa để tìm kiếm...
            </div>
          )}
        </div>
      )}
      {isTyping && displayItems.length === 0 && (
        <div className="p-4 text-sm text-gray-400 text-center">
          Không tìm thấy kết quả nào cho "{searchTerm}"
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
