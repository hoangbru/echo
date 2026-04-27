"use client";

import { useState, MouseEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, Pause, Heart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils/utils";
import { Album } from "@/types";
import { usePlayer, PlayerTrack } from "@/hooks/use-player";
import { apiClient } from "@/lib/axios";

interface AlbumCardProps {
  album: Album;
}

export function AlbumCard({ album }: AlbumCardProps) {
  const queryClient = useQueryClient();

  const { playTrack, togglePlay, currentTrack, isPlaying } = usePlayer();

  const [isHovered, setIsHovered] = useState(false);
  const [isLoadingTracks, setIsLoadingTracks] = useState(false);

  const isThisAlbumPlayingInContext = currentTrack?.albumId === album.id;
  const showVisualizer = isThisAlbumPlayingInContext && isPlaying;
  const showPausedState = isThisAlbumPlayingInContext && !isPlaying;

  const handlePlay = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoadingTracks) return;

    if (isThisAlbumPlayingInContext) {
      togglePlay();
      return;
    }

    try {
      setIsLoadingTracks(true);
      const tracksData = await queryClient.fetchQuery({
        queryKey: ["tracks", "album-detail", album.id],
        queryFn: async () => {
          const res = await apiClient.get(`/albums/${album.id}/tracks`);
          console.log(res)
          return res.data || [];
        },
      });

      if (tracksData.length === 0) {
        toast.info("Chưa có bài hát", {
          description: "Album này hiện chưa có bài hát nào được phát hành.",
        });
        return;
      }

      const queue: PlayerTrack[] = tracksData.map((t: any) => ({
        id: t.id,
        title: t.title,
        artistNames:
          t.trackArtists?.map((ta: any) => ta.artist.stageName).join(", ") ||
          album.artist?.stageName ||
          "Unknown Artist",
        imageUrl: t.imageUrl || album.coverImage || "/default-cover.jpg",
        audioUrl: t.audioUrl,
        albumId: album.id,
      }));

      playTrack(queue[0], queue);
    } catch (error) {
      console.error("Lỗi:", error);
    } finally {
      setIsLoadingTracks(false);
    }
  };

  return (
    <Link href={`/album/${album.id}`}>
      <div
        className="bg-card rounded-xl p-4 border border-border/50 hover:border-primary/40 hover:bg-[#1A1A1A] transition-all duration-300 group cursor-pointer h-full flex flex-col"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Album Cover Area */}
        <div className="relative mb-4 aspect-square rounded-lg overflow-hidden bg-muted">
          {album.coverImage ? (
            <Image
              src={album.coverImage}
              alt={album.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-black flex items-center justify-center">
              <div className="text-4xl text-neutral-600">🎵</div>
            </div>
          )}

          {showVisualizer && !isHovered && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
              <div className="flex items-end gap-[3px] h-6">
                <div className="w-1 bg-primary rounded-full h-5 animate-now-playing-bar-1" />
                <div className="w-1 bg-primary rounded-full h-3 animate-now-playing-bar-2" />
                <div className="w-1 bg-primary rounded-full h-6 animate-now-playing-bar-3" />
                <div className="w-1 bg-primary rounded-full h-4 animate-now-playing-bar-1" />
              </div>
            </div>
          )}

          {showPausedState && !isHovered && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10 text-primary">
              <div className="flex items-end gap-[3px] h-6">
                <div className="w-1 bg-current rounded-full h-3" />
                <div className="w-1 bg-current rounded-full h-5" />
                <div className="w-1 bg-current rounded-full h-2" />
              </div>
            </div>
          )}

          {isHovered && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[2px] transition-all duration-300 z-10">
              <Button
                onClick={handlePlay}
                disabled={isLoadingTracks}
                className="bg-primary hover:bg-primary/90 rounded-full p-3 shadow-[0_0_20px_rgba(255,26,140,0.6)]"
              >
                {isLoadingTracks ? (
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                ) : showVisualizer ? (
                  <Pause className="w-5 h-5 fill-white text-white" />
                ) : (
                  <Play className="w-5 h-5 fill-white text-white translate-x-[2px]" />
                )}
              </Button>
            </div>
          )}
        </div>

        <div className="flex-1">
          <p
            className={cn(
              "font-semibold text-sm text-foreground truncate group-hover:text-primary transition",
              isThisAlbumPlayingInContext && "text-primary",
            )}
          >
            {album.title}
          </p>
          <p className="text-xs text-muted-foreground truncate hover:text-primary transition mt-1">
            {album.artist?.stageName}
          </p>
        </div>
      </div>
    </Link>
  );
}
