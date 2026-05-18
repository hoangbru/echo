"use client";

import Image from "next/image";

import { useAuth } from "@/hooks/use-auth";

interface LikedTrackHeroProps {
  totalTracks: number;
  totalMins: number;
}

export function LikedTrackHero({
  totalTracks,
  totalMins,
}: LikedTrackHeroProps) {
  const { user } = useAuth();

  return (
    <div className="relative w-full h-[30vh] md:h-[40vh] min-h-[340px] bg-gradient-to-b from-neutral-600 to-[#121212] px-6 pt-20 pb-6 flex items-end">
      <div className="flex flex-col md:flex-row md:items-end gap-6 z-10 w-full">
        <div className="relative w-48 h-48 md:w-60 md:h-60 shadow-[0_4px_60px_rgba(0,0,0,0.5)] shrink-0 group">
          <Image
            src={"/liked-playlist.png"}
            alt="liked-playlist"
            fill
            className="object-cover rounded-sm"
          />
        </div>
        <div className="flex flex-col gap-2 text-white">
          <span className="text-xs md:text-sm font-bold uppercase drop-shadow-md">
            Playlist
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter pb-2 drop-shadow-lg truncate">
            Bài hát đã thích
          </h1>
          <div className="flex items-center gap-2 text-sm font-medium mt-2 flex-wrap">
            {user?.avatar ? (
              <div className="relative w-6 h-6 rounded-full">
                <Image
                  src={user?.avatar}
                  alt={user?.fullName || "Profile"}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-purple-600 text-white font-bold uppercase text-sm">
                {(user?.fullName || user?.username || "U")[0]}
              </div>
            )}
            <span className="hover:underline cursor-pointer font-bold">
              {user?.username}
            </span>
            <span className="text-gray-300">• {totalTracks} bài hát,</span>
            <span className="text-gray-400 font-normal">
              khoảng {totalMins} phút
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
