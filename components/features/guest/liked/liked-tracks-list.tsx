"use client";

import { useEffect } from "react";
import { Clock, Heart, RefreshCcw } from "lucide-react";
import { useInView } from "react-intersection-observer";

import { LikedTrackRow } from "./liked-track-row";

import { TrackDetail } from "@/types";
import { PlayerTrack, usePlayer } from "@/hooks/use-player";
import { useLikedTracks } from "@/hooks/use-tracks";
import { Button } from "@/components/ui/button";

interface LikedTracksContainerProps {
  tracks: TrackDetail[];
}

export function LikedTracksList({ tracks }: LikedTracksContainerProps) {
  const { isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useLikedTracks({ limit: 15 });

  const { ref, inView } = useInView();

  const { playTrack, togglePlay, currentTrack, isPlaying } = usePlayer();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handlePlaySingleTrack = (track: TrackDetail, index: number) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
      return;
    }

    const queue: PlayerTrack[] = tracks.map((t) => ({
      id: t.id,
      title: t.title,
      lyrics: t.lyrics || "",
      artistNames:
        t.artists?.map((ta: any) => ta.stageName).join(", ") ||
        "Unknown Artist",
      imageUrl: t.imageUrl || "/default-cover.jpg",
      audioUrl: t.audioUrl,
      albumId: t.albumId || "",
    }));

    playTrack(queue[index], queue);
  };

  if (!tracks || tracks.length === 0) {
    return (
      <div className="py-20 text-center flex flex-col items-center gap-4">
        <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-2">
          <Heart className="w-10 h-10 text-muted-foreground/60" />
        </div>
        <h3 className="text-xl font-bold text-foreground">
          Chưa có bài hát nào
        </h3>
        <p className="text-muted-foreground">
          Hãy tìm các bài hát bạn yêu thích và nhấn vào hình trái tim.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="grid grid-cols-[50px_minmax(0,1fr)_100px] lg:grid-cols-[50px_minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1fr)_100px] gap-4 px-4 py-2 border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
        <div className="text-center">#</div>
        <div>Tiêu đề</div>
        <div className="hidden lg:block">Album</div>
        <div className="hidden lg:block">Ngày thêm</div>
        <div className="flex justify-center">
          <Clock className="w-4 h-4" />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {isError ? (
          <div className="py-20 text-center">
            <div className="flex flex-col items-center justify-center gap-4">
              <p className="text-destructive font-medium">
                Đã có lỗi xảy ra khi tải danh sách bài hát.
              </p>
              <Button
                variant="outline"
                onClick={() => refetch()}
                className="border-border text-muted-foreground hover:text-foreground"
              >
                <RefreshCcw className="w-4 h-4 mr-2" /> Thử lại
              </Button>
            </div>
          </div>
        ) : (
          tracks.map((track, index) => {
            const isThisTrackPlaying = currentTrack?.id === track.id;
            const isActuallyPlaying = isThisTrackPlaying && isPlaying;

            return (
              <LikedTrackRow
                key={track.id}
                track={track}
                index={index}
                isThisTrackPlaying={isThisTrackPlaying}
                isActuallyPlaying={isActuallyPlaying}
                onPlaySingleTrack={handlePlaySingleTrack}
              />
            );
          })
        )}
        {isFetchingNextPage && (
          <div
            ref={ref}
            className="h-10 w-full flex items-center justify-center mt-4"
          >
            <span className="text-muted-foreground animate-pulse text-sm">
              Đang tải thêm...
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
