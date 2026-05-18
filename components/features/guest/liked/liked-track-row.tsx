import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Play, Heart, Pause } from "lucide-react";

import { cn } from "@/lib/utils/helpers";
import { formatDate, formatDuration } from "@/lib/utils/format";
import { TrackDetail } from "@/types";
import { TrackService } from "@/lib/services";
import { useAuth } from "@/hooks/use-auth";
import { createClient } from "@/lib/supabase/client";

interface LikedTrackRowProps {
  track: TrackDetail;
  index: number;
  refetch: () => void;
  isThisTrackPlaying: boolean;
  isActuallyPlaying: boolean;
  onPlaySingleTrack: (track: TrackDetail, index: number) => void;
}

export function LikedTrackRow({
  track,
  index,
  refetch,
  isThisTrackPlaying,
  isActuallyPlaying,
  onPlaySingleTrack,
}: LikedTrackRowProps) {
  const supabase = createClient();
  const { user } = useAuth();

  const [isLoadingLikeTrack, setIsLoadingLikeTrack] = useState<boolean>(false);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoadingLikeTrack(true);

    try {
      await TrackService.unlikeTrack(supabase, user?.id || "", track.id);
      refetch();
    } catch (error) {
      toast.error("Đã có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setIsLoadingLikeTrack(true);
    }
  };

  return (
    <div
      className="group grid grid-cols-[50px_minmax(0,1fr)_100px] lg:grid-cols-[50px_minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1fr)_100px] gap-4 px-4 py-2 rounded-md hover:bg-card transition-colors items-center cursor-pointer"
      onDoubleClick={() => onPlaySingleTrack(track, index)}
    >
      {/* Cột 1: STT / Icon Play / Sóng nhạc */}
      <div className="text-center text-muted-foreground text-sm font-medium relative w-full h-full flex items-center justify-center">
        <span
          className={cn(
            "group-hover:opacity-0",
            isThisTrackPlaying ? "text-primary opacity-100" : "opacity-100",
          )}
        >
          {isActuallyPlaying ? (
            <div className="flex items-end gap-[2px] h-3">
              <div className="w-[3px] bg-primary rounded-full h-3 animate-now-playing-bar-1" />
              <div className="w-[3px] bg-primary rounded-full h-2 animate-now-playing-bar-2" />
              <div className="w-[3px] bg-primary rounded-full h-3 animate-now-playing-bar-3" />
            </div>
          ) : (
            index + 1
          )}
        </span>
        <button
          onClick={() => onPlaySingleTrack(track, index)}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {isActuallyPlaying ? (
            <Pause className="w-4 h-4 fill-primary text-primary" />
          ) : (
            <Play className="w-4 h-4 fill-foreground text-foreground" />
          )}
        </button>
      </div>

      <div className="flex items-center gap-3 min-w-0 pr-4">
        <div className="relative w-10 h-10 shrink-0 bg-muted rounded-sm overflow-hidden">
          <Image
            src={track.imageUrl || "/default-cover.jpg"}
            alt={track.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col min-w-0">
          <span
            className={cn(
              "text-base truncate font-medium",
              isThisTrackPlaying ? "text-primary" : "text-foreground",
            )}
          >
            {track.title}
          </span>
          <span className="text-sm text-muted-foreground truncate group-hover:text-foreground transition-colors mt-0.5">
            {track.artists?.map((a) => a.stageName).join(", ") ||
              "Unknown Artist"}
          </span>
        </div>
      </div>

      <div className="hidden lg:block text-sm text-muted-foreground hover:text-foreground hover:underline cursor-pointer truncate">
        {track.album?.title || "Single"}
      </div>

      <div className="hidden lg:block text-sm text-muted-foreground truncate">
        {track.createdAt ? formatDate(track.createdAt) : "Gần đây"}
      </div>

      <div className="text-sm text-muted-foreground flex justify-center items-center gap-4">
        <button onClick={handleLikeClick} disabled={isLoadingLikeTrack}>
          <Heart className="w-4 h-4 transition-colors fill-primary text-primary opacity-100" />
        </button>
        {formatDuration(track.duration)}
      </div>
    </div>
  );
}
