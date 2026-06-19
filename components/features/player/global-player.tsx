"use client";

import { useEffect, useRef, useState } from "react";
import { ListMusic, ChevronDown } from "lucide-react";

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
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    currentTrack,
    isPlaying,
    volume,
    repeatMode,
    playNext,
    toggleQueue,
  } = usePlayer();

  const progressRef = useRef(0);
  const durationRef = useRef(0);
  const trackRef = useRef(currentTrack);

  useEffect(() => {
    trackRef.current = currentTrack;
    progressRef.current = 0;

    return () => {
      const trackToLog = trackRef.current;
      const finalProgress = Math.floor(progressRef.current);
      const finalDuration = Math.floor(durationRef.current);

      if (trackToLog && finalProgress >= 10) {
        apiClient
          .post("/streams/increment", {
            trackId: trackToLog.id,
            albumId: trackToLog.albumId,
            duration: finalDuration,
            progress: finalProgress,
          })
          .catch((err) => console.error("Lỗi khi gửi log nghe nhạc:", err));
      }
    };
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

  const handleSeekToTime = (time: number) => {
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSeekToTime(Number(e.target.value));
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const time = audioRef.current.currentTime;
    setCurrentTime(time);
    progressRef.current = time;
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    const dur = audioRef.current.duration;
    setDuration(dur);
    durationRef.current = dur;
  };

  const mobileProgressPercent =
    duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <TooltipProvider delayDuration={300}>
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      <div
        className={cn(
          "fixed inset-0 z-[90] bg-background flex flex-col p-6 transition-transform duration-500 ease-in-out md:hidden",
          isExpanded ? "translate-y-0" : "translate-y-full",
        )}
      >
        <button
          onClick={() => setIsExpanded(false)}
          className="absolute top-6 left-6 p-2 text-muted-foreground hover:text-foreground"
        >
          <ChevronDown className="w-8 h-8" />
        </button>

        <div className="flex-1 flex flex-col items-center justify-center gap-8 mt-12">
          <div className="w-64 h-64 relative rounded-lg overflow-hidden shadow-2xl">
            <img
              src={currentTrack.imageUrl}
              alt="cover"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="w-full flex justify-between items-center">
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold text-foreground">
                {currentTrack.title}
              </h2>
              <p className="text-lg text-muted-foreground">
                {currentTrack.artistNames}
              </p>
            </div>
            <LikeButton />
          </div>

          <ProgressBar
            currentTime={currentTime}
            duration={duration}
            onSeek={handleSeek}
          />

          <div className="w-full flex items-center justify-between">
            <ShuffleButton />
            <PrevButton />
            <PlayPauseButton />
            <NextButton />
            <RepeatButton />
          </div>

          <div className="w-full flex items-center justify-between mt-4 px-4">
            <LyricsPlayer
              currentTime={currentTime}
              onSeekToTime={handleSeekToTime}
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={toggleQueue}
                  className="text-muted-foreground p-2"
                >
                  <ListMusic className="w-6 h-6" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Danh sách chờ</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 h-16 md:h-24 bg-background border-t border-border px-2 md:px-4 flex items-center justify-between z-[110]",
          isExpanded && "hidden md:flex",
        )}
      >
        <div className="absolute top-0 left-0 right-0 h-[2px] md:hidden bg-muted">
          <div
            className="h-full bg-primary transition-all duration-150 ease-linear"
            style={{ width: `${mobileProgressPercent}%` }}
          />
        </div>

        <div
          className="flex items-center gap-2 md:gap-4 min-w-0 flex-1 cursor-pointer md:cursor-default"
          onClick={() => {
            if (window.innerWidth < 768) setIsExpanded(true);
          }}
        >
          <TrackInfo />
          <div className="hidden md:block" onClick={(e) => e.stopPropagation()}>
            <LikeButton />
          </div>
        </div>

        <div className="flex md:hidden items-center gap-2 shrink-0 pr-1">
          <LikeButton />
          <PlayPauseButton />
          <NextButton />
        </div>

        <div className="hidden md:flex flex-col items-center max-w-[40%] w-full gap-2">
          <div className="flex items-center gap-6">
            <ShuffleButton />
            <PrevButton />
            <PlayPauseButton />
            <NextButton />
            <RepeatButton />
          </div>
          <ProgressBar
            currentTime={currentTime}
            duration={duration}
            onSeek={handleSeek}
          />
        </div>

        <div className="hidden md:flex items-center justify-end gap-4 w-[30%] min-w-[150px]">
          <LyricsPlayer
            currentTime={currentTime}
            onSeekToTime={handleSeekToTime}
          />
          <button
            onClick={toggleQueue}
            className="text-muted-foreground hover:text-foreground transition-colors p-2"
          >
            <ListMusic className="w-5 h-5" />
          </button>
          <VolumeControl />
        </div>
      </div>
    </TooltipProvider>
  );
}
