import { Play, Pause } from "lucide-react";

import { DropdownTrackMenu } from "@/components/shared";

import { cn } from "@/lib/utils/helpers";
import { formatDuration } from "@/lib/utils/format";
import { TrackDetail, FeatArtist } from "@/types";
import { PlayerTrack, usePlayer } from "@/hooks/use-player";

interface TrackListRowProps {
  track: TrackDetail;
  contextTracks?: TrackDetail[];
  contextId?: string;
}

const mapToPlayerTrack = (t: TrackDetail): PlayerTrack => ({
  id: t.id,
  title: t.title,
  lyrics: t.lyrics ?? undefined,
  artistNames:
    t.artists?.map((ta: FeatArtist) => ta.stageName).join(", ") ||
    "Unknown Artist",
  imageUrl: t.imageUrl || t.album?.coverImage || "/default-cover.jpg",
  audioUrl: t.audioUrl,
  albumId: t.album?.id || t.albumId || "",
});

export function TrackListRow({
  track,
  contextTracks,
  contextId,
}: TrackListRowProps) {
  const { playTrack, togglePlay, currentTrack, isPlaying } = usePlayer();

  const isThisTrackActive = currentTrack?.id === track.id;
  const isThisTrackPlaying = isThisTrackActive && isPlaying;

  const onPlaySingleTrack = (trackDetail: TrackDetail) => {
    if (isThisTrackActive) {
      togglePlay();
      return;
    }

    const trackPlayer = mapToPlayerTrack(trackDetail);

    const queuePlayers: PlayerTrack[] = contextTracks
      ? contextTracks.map(mapToPlayerTrack)
      : [trackPlayer];

    const resolvedContextId = contextId || trackDetail.id;

    playTrack(trackPlayer, queuePlayers, resolvedContextId);
  };

  return (
    <div
      className="group grid grid-cols-[50px_minmax(0,1fr)_100px] md:grid-cols-[50px_minmax(0,2fr)_minmax(0,1fr)_100px] gap-4 px-4 py-2.5 rounded-lg hover:bg-accent transition-colors items-center cursor-pointer"
      onDoubleClick={() => onPlaySingleTrack(track)}
    >
      <div className="text-center text-muted-foreground text-SM font-medium relative w-full h-full flex items-center justify-center group-hover:text-foreground">
        <span
          className={cn(
            "group-hover:opacity-0",
            isThisTrackActive ? "text-primary opacity-100" : "opacity-100",
          )}
        >
          {isThisTrackPlaying ? (
            <div className="flex items-end gap-[2px] h-3">
              <div className="w-[3px] bg-primary rounded-full h-3 animate-now-playing-bar-1" />
              <div className="w-[3px] bg-primary rounded-full h-2 animate-now-playing-bar-2" />
              <div className="w-[3px] bg-primary rounded-full h-3 animate-now-playing-bar-3" />
            </div>
          ) : (
            track.trackNumber || "-"
          )}
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onPlaySingleTrack(track);
          }}
          className={cn(
            "absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
            isThisTrackActive ? "opacity-100 text-primary" : "text-foreground",
          )}
        >
          {isThisTrackPlaying ? (
            <Pause className="w-4 h-4 fill-primary text-primary" />
          ) : (
            <Play className="w-4 h-4 fill-foreground text-foreground translate-x-[1px]" />
          )}
        </button>
      </div>

      <div className="flex flex-col min-w-0 pr-4">
        <span
          className={cn(
            "text-[16px] truncate font-medium",
            isThisTrackActive ? "text-primary" : "text-foreground",
          )}
        >
          {track.title}
        </span>
        <span className="flex items-center gap-2 text-[14px] text-muted-foreground truncate group-hover:text-foreground transition-colors mt-0.5">
          {track.isExplicit && (
            <span
              className="inline-flex items-center justify-center w-[15px] h-[15px] bg-muted-foreground text-background rounded-sm text-[10px] font-bold p-1"
              title="Nội dung nhạy cảm (Explicit)"
            >
              E
            </span>
          )}
          {track.artists?.map((ta: FeatArtist) => ta.stageName).join(", ") ||
            "Unknown Artist"}
        </span>
      </div>

      <div className="hidden md:block text-[14px] text-muted-foreground truncate">
        {track.totalStreams?.toLocaleString() || "0"}
      </div>

      <div className="text-[14px] text-muted-foreground flex justify-center items-center gap-4">
        {formatDuration(track.duration)}
        <DropdownTrackMenu track={track} />
      </div>
    </div>
  );
}

export function TrackListRowSkeleton() {
  return (
    <div className="grid grid-cols-[50px_minmax(0,1fr)_100px] md:grid-cols-[50px_minmax(0,2fr)_minmax(0,1fr)_100px] gap-4 px-4 py-2.5 rounded-lg items-center animate-pulse">
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-4 h-4 bg-muted/40 rounded" />
      </div>

      <div className="flex flex-col gap-2 min-w-0 pr-4 mt-0.5">
        <div className="h-4 bg-muted/40 rounded w-2/3" />
        <div className="h-3 bg-muted/40 rounded w-1/3" />
      </div>

      <div className="hidden md:block">
        <div className="h-4 bg-muted/40 rounded w-1/2" />
      </div>

      <div className="flex justify-center items-center gap-4">
        <div className="h-4 bg-muted/40 rounded w-8" />
        <div className="w-5 h-5 bg-muted/40 rounded-full flex-shrink-0" />
      </div>
    </div>
  );
}
