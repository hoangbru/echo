"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { useProfile } from "@/hooks/use-auth";

interface LikedTrackHeroProps {
  totalTracks: number;
  totalMins: number;
}

export function LikedTrackHero({
  totalTracks,
  totalMins,
}: LikedTrackHeroProps) {
  const { data: profile } = useProfile();

  if (!profile) return null;

  return (
    <div className="relative w-full h-[30vh] md:h-[40vh] min-h-[340px] bg-gradient-to-b from-secondary to-background px-6 pt-20 pb-6 flex items-end">
      <div className="flex flex-col md:flex-row md:items-end gap-6 z-10 w-full">
        {/* Khối Ảnh Trái Tim Gradient */}
        <div className="relative w-48 h-48 md:w-60 md:h-60 shadow-[0_4px_60px_rgba(0,0,0,0.5)] shrink-0 group rounded-lg overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-primary via-primary/70 to-black/90 flex items-center justify-center transition-colors duration-500">
            <Heart className="w-20 h-20 md:w-24 md:h-24 text-white fill-white drop-shadow-md" />
          </div>
        </div>

        {/* Thông tin Playlist */}
        <div className="flex flex-col gap-2 text-foreground">
          <span className="text-xs md:text-sm font-bold uppercase drop-shadow-md text-primary">
            Playlist
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter pb-2 drop-shadow-lg truncate">
            Bài hát đã thích
          </h1>
          <div className="flex items-center gap-2 text-sm font-medium mt-2 flex-wrap">
            {profile?.avatar ? (
              <div className="relative w-6 h-6 rounded-full overflow-hidden border border-border">
                <Image
                  src={profile?.avatar}
                  alt={profile?.fullName || "Profile"}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-purple-600 text-primary-foreground font-bold uppercase text-sm border border-border">
                {(profile?.fullName || profile?.username || "U")[0]}
              </div>
            )}
            <span className="hover:underline cursor-pointer font-bold hover:text-primary transition-colors">
              {profile?.username}
            </span>
            <span className="text-muted-foreground">
              • {totalTracks} bài hát,
            </span>
            <span className="text-muted-foreground/80 font-normal">
              khoảng {totalMins} phút
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
