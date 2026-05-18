"use client";

import { useEffect, useRef, useState } from "react";
import { ListMusic } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TrackInfo } from "./track-info";
import { ShuffleButton } from "./shuffle-button";
import { PrevButton } from "./prev-button";
import { PlayPauseButton } from "./play-pause-button";
import { NextButton } from "./next-button";
import { RepeatButton } from "./repeat-button";
import { ProgressBar } from "./progress-bar";
import { LyricsPlayer } from "./lyrics-player";
import { VolumeControl } from "./volume-control";
import { LikeButton } from "./like-button";

import { usePlayer } from "@/hooks/use-player";
import { cn } from "@/lib/utils/helpers";
import { apiClient } from "@/lib/axios";

export function GlobalPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasCountedStream, setHasCountedStream] = useState(false);

  const {
    currentTrack,
    isPlaying,
    volume,
    repeatMode,
    isQueueVisible,
    playNext,
    toggleQueue,
  } = usePlayer();

  useEffect(() => {
    setHasCountedStream(false);
  }, [currentTrack?.id]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((e) => console.log("Lỗi autoplay:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleEnded = () => {
    if (repeatMode === "one" && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      playNext();
    }
  };

  if (!currentTrack) return null;

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleTimeUpdate = async () => {
    if (!audioRef.current || !currentTrack) return;

    const time = audioRef.current.currentTime;
    setCurrentTime(time);

    if (time > 30 && !hasCountedStream) {
      setHasCountedStream(true);

      try {
        await apiClient.post("/streams/increment", {
          trackId: currentTrack.id,
          albumId: currentTrack.albumId,
        });
      } catch (error) {
        console.error("Lỗi khi cộng view:", error);
      }
    }
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="fixed bottom-0 left-0 right-0 h-24 bg-background border-t border-border px-4 flex items-center justify-between z-[110]">
        <audio
          ref={audioRef}
          src={currentTrack.audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
          onEnded={handleEnded}
        />

        {/* Track info */}
        <div className="flex items-center gap-4 w-[30%] min-w-[180px]">
          <TrackInfo />

          {/* Like Button */}
          <LikeButton />
        </div>

        <div className="flex flex-col items-center max-w-[40%] w-full gap-2">
          <div className="flex items-center gap-6">
            {/* Shuffle */}
            <ShuffleButton />

            {/* Prev */}
            <PrevButton />

            {/* Play/Pause */}
            <PlayPauseButton />

            {/* Next */}
            <NextButton />

            {/* Repeat */}
            <RepeatButton />
          </div>

          {/* Progress Bar */}
          <ProgressBar
            currentTime={currentTime}
            duration={duration}
            onSeek={handleSeek}
          />
        </div>

        <div className="flex items-center justify-end gap-4 w-[30%] min-w-[150px]">
          {/* Lyrics */}
          <LyricsPlayer currentTime={currentTime} />

          {/* Queue */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={toggleQueue}
                className={cn(
                  "transition-colors p-2",
                  isQueueVisible
                    ? "text-primary relative after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-primary after:rounded-full"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <ListMusic className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="bg-popover text-popover-foreground border-border rounded-md text-xs font-semibold px-3 py-1.5 mb-2"
            >
              <p>Danh sách chờ</p>
            </TooltipContent>
          </Tooltip>

          {/* Volume Control */}
          <VolumeControl />
        </div>
      </div>
    </TooltipProvider>
  );
}
