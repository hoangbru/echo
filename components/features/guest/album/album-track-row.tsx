import { Play, Pause } from "lucide-react";

import { cn } from "@/lib/utils/helpers";
import { formatDuration } from "@/lib/utils/format";
import { TrackDetail, AlbumDetail, FeatArtist } from "@/types";
import { DropdownTrackMenu } from "@/components/shared";

interface AlbumTrackRowProps {
  track: TrackDetail;
  index: number;
  album: AlbumDetail;
  isThisTrackPlaying: boolean;
  onPlaySingleTrack: (track: TrackDetail, index: number) => void;
}

export function AlbumTrackRow({
  track,
  index,
  album,
  isThisTrackPlaying,
  onPlaySingleTrack,
}: AlbumTrackRowProps) {
  return (
    <div
      className="group grid grid-cols-[50px_minmax(0,1fr)_100px] md:grid-cols-[50px_minmax(0,2fr)_minmax(0,1fr)_100px] gap-4 px-4 py-2.5 rounded-lg hover:bg-card transition-colors items-center cursor-pointer"
      onDoubleClick={() => onPlaySingleTrack(track, index)}
    >
      {/* Cột 1: STT / Icon Play / Sóng nhạc */}
      <div className="text-center text-muted-foreground text-sm font-medium relative w-full h-full flex items-center justify-center">
        <span
          className={cn(
            "group-hover:opacity-0 transition-opacity",
            isThisTrackPlaying ? "text-primary opacity-100" : "opacity-100",
          )}
        >
          {isThisTrackPlaying ? (
            <div className="flex items-end gap-[2px] h-3">
              <div className="w-[3px] bg-primary rounded-full h-3 animate-now-playing-bar-1" />
              <div className="w-[3px] bg-primary rounded-full h-2 animate-now-playing-bar-2" />
              <div className="w-[3px] bg-primary rounded-full h-3 animate-now-playing-bar-3" />
            </div>
          ) : (
            track.trackNumber
          )}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPlaySingleTrack(track, index);
          }}
          className={cn(
            "absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
            isThisTrackPlaying ? "" : "opacity-100 text-primary",
          )}
        >
          {isThisTrackPlaying ? (
            <Pause className="w-4 h-4 fill-primary text-primary" />
          ) : (
            <Play className="w-4 h-4 fill-foreground text-foreground" />
          )}
        </button>
      </div>

      {/* Cột 2: Tên bài & Ca sĩ */}
      <div className="flex flex-col min-w-0 pr-4">
        <span
          className={cn(
            "text-base truncate font-medium",
            isThisTrackPlaying ? "text-primary" : "text-foreground",
          )}
        >
          {track.title}
        </span>
        <span className="flex items-center gap-2 text-sm text-muted-foreground truncate group-hover:text-foreground transition-colors mt-0.5">
          {/* Chuẩn hóa icon Explicit */}
          {track.isExplicit && (
            <span
              className="inline-flex items-center justify-center w-[15px] h-[15px] bg-muted-foreground text-muted rounded-sm text-[10px] font-bold p-1"
              title="Nội dung nhạy cảm (Explicit)"
            >
              E
            </span>
          )}
          {track.artists?.map((ta: FeatArtist) => ta.stageName).join(", ") ||
            album.artist?.stageName ||
            "Unknown Artist"}
        </span>
      </div>

      {/* Cột 3: Lượt nghe */}
      <div className="hidden md:block text-sm text-muted-foreground truncate">
        {track.totalStreams?.toLocaleString() || "0"}
      </div>

      {/* Cột 4: Thời lượng và Nút Like */}
      <div className="text-sm text-muted-foreground flex justify-center items-center gap-4">
        {formatDuration(track.duration)}
        <DropdownTrackMenu track={track} />
      </div>
    </div>
  );
}
