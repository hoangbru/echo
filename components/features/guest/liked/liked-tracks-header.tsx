import { Heart, Play } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useAuth } from "@/hooks/use-auth";

interface LikedTracksHeaderProps {
  totalTracks: number;
  onPlayAll: () => void;
}

export function LikedTracksHeader({
  totalTracks,
  onPlayAll,
}: LikedTracksHeaderProps) {
  const { user } = useAuth();

  return (
    <div className="flex flex-col">
      <div className="relative flex flex-col md:flex-row items-end gap-6 p-6 pt-20 pb-8 bg-gradient-to-b from-indigo-800 to-background/90">
        <div className="w-48 h-48 sm:w-56 sm:h-56 shadow-2xl rounded-md bg-gradient-to-br from-indigo-400 to-indigo-200 flex items-center justify-center shrink-0">
          <Heart className="w-20 h-20 text-white fill-white" />
        </div>

        {/* Thông tin Meta */}
        <div className="flex flex-col gap-2 text-foreground mt-4 md:mt-0">
          <span className="text-sm font-bold uppercase tracking-wider text-white/80">
            Playlist
          </span>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-white py-2">
            Bài hát đã thích
          </h1>
          <div className="flex items-center gap-2 text-sm mt-2 font-medium">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[10px] text-primary-foreground font-bold">
              {user?.user_metadata?.name?.charAt(0) || "E"}
            </div>
            <span className="hover:underline cursor-pointer text-white">
              {user?.user_metadata?.name || "Người dùng Echo"}
            </span>
            <span className="text-white/70">• {totalTracks} bài hát</span>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 flex items-center gap-6 bg-background">
        <Button
          size="icon"
          className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 hover:scale-105 transition-all shadow-lg"
          onClick={onPlayAll}
          disabled={totalTracks === 0}
        >
          <Play className="w-6 h-6 fill-black text-black ml-1" />
        </Button>
      </div>
    </div>
  );
}
