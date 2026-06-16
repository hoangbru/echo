"use client";

import { MouseEvent } from "react";
import { Clock, Play, Pause, Trash2 } from "lucide-react";

import { PlaylistDetail } from "@/types/playlist.type";
import { formatDate, formatDuration } from "@/lib/utils/format";
import { usePlayer, PlayerTrack } from "@/hooks/use-player";
import { cn } from "@/lib/utils/helpers";
import { TrackDetail, FeatArtist } from "@/types";

interface PlaylistTrackListProps {
  playlist: PlaylistDetail;
  tracks: PlaylistDetail["tracks"];
  onDeleteTrack: (id: string) => void;
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

export function PlaylistTrackList({
  playlist,
  tracks,
  onDeleteTrack,
}: PlaylistTrackListProps) {
  const { playTrack, togglePlay, currentTrack, isPlaying } = usePlayer();

  const handlePlayTrackClick = (trackDetail: TrackDetail) => {
    const isThisTrackActive = currentTrack?.id === trackDetail.id;

    if (isThisTrackActive) {
      togglePlay();
      return;
    }

    const trackPlayer = mapToPlayerTrack(trackDetail);
    const queuePlayers: PlayerTrack[] = tracks.map(mapToPlayerTrack);

    playTrack(trackPlayer, queuePlayers, playlist.id);
  };

  return (
    <div className="mt-6">
      <div className="grid grid-cols-[50px_4fr_3fr_2fr_120px] gap-4 px-4 py-2 border-b border-border text-[14px] text-muted-foreground font-medium mb-2">
        <div className="text-center">#</div>
        <div>Tiêu đề</div>
        <div>Album</div>
        <div>Ngày thêm</div>
        <div className="flex justify-end pr-4">
          <Clock className="w-4 h-4" />
        </div>
      </div>

      {/* Track List */}
      <div className="flex flex-col gap-1">
        {tracks.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-[14px]">
            Chưa có bài hát nào trong danh sách phát này.
          </div>
        ) : (
          tracks.map((track, index) => {
            const isThisTrackActive = currentTrack?.id === track.id;
            const isThisTrackPlaying = isThisTrackActive && isPlaying;

            return (
              <div
                key={track.id}
                className="group grid grid-cols-[50px_4fr_3fr_2fr_120px] gap-4 px-4 py-2.5 rounded-lg hover:bg-accent transition-colors items-center cursor-pointer text-[14px]"
                onDoubleClick={() => handlePlayTrackClick(track)}
              >
                <div className="text-center text-muted-foreground text-[14px] font-medium relative w-full h-10 flex items-center justify-center">
                  <span
                    className={cn(
                      "group-hover:opacity-0 transition-opacity",
                      isThisTrackActive
                        ? "text-primary opacity-100"
                        : "opacity-100",
                    )}
                  >
                    {isThisTrackPlaying ? (
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
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayTrackClick(track);
                    }}
                    className={cn(
                      "absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
                      isThisTrackActive
                        ? "opacity-100 text-primary"
                        : "text-foreground",
                    )}
                  >
                    {isThisTrackPlaying ? (
                      <Pause className="w-4 h-4 fill-primary text-primary" />
                    ) : (
                      <Play className="w-4 h-4 fill-foreground text-foreground translate-x-[1px]" />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-3 min-w-0 pr-4">
                  <img
                    src={track.imageUrl || "/default-cover.jpg"}
                    alt={track.title}
                    className="w-10 h-10 object-cover rounded-md shadow-sm shrink-0"
                  />
                  <div className="overflow-hidden">
                    <p
                      className={cn(
                        "font-medium truncate group-hover:text-primary transition-colors text-[16px]",
                        isThisTrackActive ? "text-primary" : "text-foreground",
                      )}
                    >
                      {track.title}
                    </p>
                    <p className="text-muted-foreground text-[14px] truncate flex items-center gap-2 mt-0.5 group-hover:text-foreground transition-colors">
                      {track.isExplicit && (
                        <span
                          className="inline-flex items-center justify-center w-[15px] h-[15px] bg-muted-foreground text-background rounded-sm text-[10px] font-bold p-1 shrink-0"
                          title="Nội dung nhạy cảm (Explicit)"
                        >
                          E
                        </span>
                      )}
                      {track.artists
                        ?.map((ta: FeatArtist) => ta.stageName)
                        .join(", ") || "Unknown Artist"}
                    </p>
                  </div>
                </div>

                <div className="text-muted-foreground truncate hover:text-foreground cursor-pointer transition-colors">
                  {track.album?.title || "Đơn khúc"}
                </div>

                <div className="text-muted-foreground group-hover:text-foreground/80 transition-colors">
                  {formatDate(track.addedAt)}
                </div>

                <div className="text-[14px] text-muted-foreground flex justify-end items-center gap-4 pr-2">
                  <span>{formatDuration(track.duration)}</span>

                  <button
                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation();
                      onDeleteTrack(track.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive/80 transition-all hover:scale-110"
                    title="Xóa khỏi danh sách phát"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
