"use client";

import { Music } from "lucide-react";
import Image from "next/image";

import { PlaylistDetail } from "@/types/playlist.type";

interface PlaylistHeroSectionProps {
  playlist: PlaylistDetail;
}

export function PlaylistHeroSection({ playlist }: PlaylistHeroSectionProps) {
  const totalTracks = playlist.tracks.length;
  const totalMins = Math.round(
    playlist.tracks.reduce((sum, t) => sum + (t.duration || 0), 0) / 60000,
  );

  return (
    <div className="relative pt-20 pb-6 px-6 bg-gradient-to-b from-neutral-800/40 to-muted/20 flex flex-col md:flex-row items-end gap-6">
      <div className="w-48 h-48 md:w-60 md:h-60 bg-muted flex items-center justify-center rounded-sm shadow-2xl overflow-hidden shrink-0 group-hover:opacity-80 transition-opacity">
        {playlist.coverImage ? (
          <div className="relative w-full h-full">
            <Image
              src={playlist.coverImage}
              alt={playlist.title}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <Music className="w-24 h-24 text-muted-foreground" />
        )}
      </div>

      <div className="flex flex-col gap-2 overflow-hidden w-full text-foreground">
        <span className="text-[12px] uppercase font-bold tracking-wider hidden md:inline">
          {playlist.isPublic
            ? "Danh sách phát công khai"
            : "Danh sách phát riêng tư"}
        </span>

        <h1 className="text-xl md:text-6xl font-extrabold tracking-tight truncate py-2 select-all">
          {playlist.title}
        </h1>

        {playlist.description && (
          <p className="text-muted-foreground text-[14px] line-clamp-2 mt-1">
            {playlist.description}
          </p>
        )}

        <div className="flex items-center gap-2 text-sm font-medium mt-2 flex-wrap">
          {playlist.user.avatar ? (
            <div className="relative w-6 h-6 rounded-full overflow-hidden">
              <Image
                src={playlist.user.avatar}
                alt={playlist.user.username}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-primary/60 text-foreground font-bold uppercase text-sm">
              {(playlist.user.username || "U")[0]}
            </div>
          )}
          <span className="hover:underline cursor-pointer font-bold">
            {playlist.user.username || "User"}
          </span>
          <span className="text-gray-300">• {totalTracks} bài hát,</span>
          <span className="text-gray-400 font-normal">
            khoảng {totalMins} phút
          </span>
        </div>
      </div>
    </div>
  );
}
