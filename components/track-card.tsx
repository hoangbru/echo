"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, Heart } from "lucide-react";
import { usePlayer, Track } from "@/lib/contexts/player-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TrackCardProps {
  track: Track; // Ép kiểu chuẩn từ Context thay vì tự định nghĩa lỏng lẻo
  onPlayTrack?: (track: Track) => void;
}

export function TrackCard({ track, onPlayTrack }: TrackCardProps) {
  const { play } = usePlayer();
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    play(track); // Không cần as any nữa
    onPlayTrack?.(track);
  };

  const handleAddToFavorites = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Tương lai: Gọi API lưu Database tại đây
    setIsFavorite(!isFavorite);
  };

  return (
    <Link href={`/track/${track.id}`}>
      <div
        className="bg-card rounded-xl p-4 border border-border/50 hover:border-primary/40 hover:bg-[#1A1A1A] transition-all duration-300 group cursor-pointer h-full flex flex-col"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Album Cover */}
        <div className="relative mb-4 aspect-square rounded-lg overflow-hidden bg-muted">
          {track.coverImage ? (
            <Image
              src={track.coverImage}
              alt={track.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-black flex items-center justify-center">
              <div className="text-4xl text-neutral-600">🎵</div>
            </div>
          )}

          {/* Play Button Overlay */}
          {isHovered && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[2px] transition-all duration-300">
              <Button
                onClick={handlePlay}
                className="bg-primary hover:bg-primary/90 rounded-full p-3 shadow-[0_0_20px_rgba(255,26,140,0.6)]"
              >
                <Play className="w-5 h-5 fill-white text-white" />
              </Button>
            </div>
          )}

          {/* Duration Badge */}
          <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur px-2 py-1 rounded text-[11px] font-medium text-white">
            {Math.floor(track.duration / 60)}:
            {String(track.duration % 60).padStart(2, "0")}
          </div>
        </div>

        {/* Track Info */}
        <div className="flex-1">
          <p className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition">
            {track.title}
          </p>
          <p className="text-xs text-muted-foreground truncate hover:text-primary transition mt-1">
            {track.artist}
          </p>
        </div>

        {/* Favorite Button */}
        <Button
          onClick={handleAddToFavorites}
          variant="ghost"
          size="sm"
          className="mt-3 w-full text-xs text-muted-foreground hover:text-primary hover:bg-primary/10"
        >
          <Heart
            className={cn(
              "w-4 h-4 mr-1 transition",
              isFavorite && "fill-primary text-primary",
            )}
          />
          {isFavorite ? "Đã lưu" : "Lưu bài hát"}
        </Button>
      </div>
    </Link>
  );
}
