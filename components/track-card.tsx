"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, Heart } from "lucide-react";
import { usePlayer } from "@/lib/contexts/player-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TrackCardProps {
  track: {
    id: string;
    title: string;
    artist: { username: string; id: string } | string;
    duration: number;
    audioUrl: string;
    coverImage?: string;
    album?: { title: string };
  };
  onPlayTrack?: (track: any) => void;
}

export function TrackCard({ track, onPlayTrack }: TrackCardProps) {
  const { play } = usePlayer();
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const artistName =
    typeof track.artist === "string"
      ? track.artist
      : track.artist?.username || "Unknown";

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    play(track as any);
    onPlayTrack?.(track);
  };

  const handleAddToFavorites = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <Link href={`/track/${track.id}`}>
      <div
        className="bg-[#111111] rounded-xl p-4 border border-white/5 hover:border-pink-500/40 hover:bg-[#151515] transition-all duration-300 group cursor-pointer h-full flex flex-col"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Album Cover */}
        <div className="relative mb-4 aspect-square rounded-lg overflow-hidden bg-[#1A1A1A]">
          {track.coverImage ? (
            <Image
              src={track.coverImage}
              alt={track.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-neutral-700 to-neutral-900 flex items-center justify-center">
              <div className="text-4xl text-neutral-600">🎵</div>
            </div>
          )}

          {/* Play Button Overlay */}
          {isHovered && (
            <div
              className="absolute inset-0 
    bg-black/50 
    flex items-center justify-center 
    backdrop-blur-[1px]"
            >
              <Button
                onClick={handlePlay}
                className="bg-pink-500 
      hover:bg-pink-600 
      rounded-full p-3 
      shadow-[0_0_20px_rgba(236,72,153,0.6)]"
              >
                <Play className="w-5 h-5 fill-white" />
              </Button>
            </div>
          )}

          {/* Duration Badge */}
          <div
            className="absolute bottom-2 right-2 
bg-black/70 backdrop-blur 
px-2 py-1 rounded 
text-[11px] font-medium text-white"
          >
            {Math.floor(track.duration / 60)}:
            {String(track.duration % 60).padStart(2, "0")}
          </div>
        </div>

        {/* Track Info */}
        <div className="flex-1">
          <p
            className="font-semibold text-sm 
text-white/90 
truncate 
group-hover:text-pink-400 
transition"
          >
            {track.title}
          </p>
          <p className="text-xs text-white/50 truncate hover:text-pink-400 transition">
            {artistName}
          </p>
          {track.album && (
            <p className="text-xs text-white/40 truncate mt-1">
              {track.album.title}
            </p>
          )}
        </div>

        {/* Favorite Button */}
        <Button
          onClick={handleAddToFavorites}
          variant="ghost"
          size="sm"
          className="mt-3 w-full text-xs 
  text-white/60 
  hover:text-pink-400 
  hover:bg-pink-500/10"
        >
          <Heart
            className={cn(
              "w-4 h-4 mr-1 transition",
              isFavorite && "fill-pink-500 text-pink-500",
            )}
          />
          {isFavorite ? "Saved" : "Save"}
        </Button>
      </div>
    </Link>
  );
}
