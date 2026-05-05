"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Repeat1,
  ListMusic,
  Heart,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { usePlayer } from "@/hooks/use-player";
import { cn } from "@/lib/utils/utils";
import { formatTime } from "@/lib/utils/format";
import { apiClient } from "@/lib/axios";

export function GlobalPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [hasCountedStream, setHasCountedStream] = useState(false);

  const {
    currentTrack,
    isPlaying,
    volume,
    isShuffle,
    repeatMode,
    isQueueVisible,
    togglePlay,
    playNext,
    playPrev,
    setVolume,
    toggleShuffle,
    toggleRepeat,
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

  // Xử lý tự động chuyển bài khi hết (kết hợp Repeat)
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

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const volumePercent = volume * 100;

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
      <div className="fixed bottom-0 left-0 right-0 h-24 bg-background border-t border-white/10 px-4 flex items-center justify-between z-[100]">
        <audio
          ref={audioRef}
          src={currentTrack.audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
          onEnded={handleEnded}
        />

        <div className="flex items-center gap-4 w-[30%] min-w-[180px]">
          <div className="relative w-14 h-14 rounded-md overflow-hidden shrink-0">
            <Image
              src={currentTrack.imageUrl || "/default-cover.jpg"}
              alt={currentTrack.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col truncate">
            <h4 className="text-white text-sm font-bold truncate hover:underline cursor-pointer">
              {currentTrack.title}
            </h4>
            <span className="text-gray-400 text-xs truncate hover:underline cursor-pointer">
              {currentTrack.artistNames}
            </span>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="ml-2 text-gray-400 hover:text-white transition-transform active:scale-90"
              >
                <Heart
                  className={cn(
                    "w-5 h-5 transition-colors",
                    isLiked && "fill-primary text-primary",
                  )}
                />
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="bg-[#282828] text-white border-none rounded-md text-xs font-semibold px-3 py-1.5 mb-2"
            >
              <p>{isLiked ? "Xóa khỏi Thư viện" : "Lưu vào Thư viện"}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="flex flex-col items-center max-w-[40%] w-full gap-2">
          <div className="flex items-center gap-6">
            {/* Shuffle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={toggleShuffle}
                  className={cn(
                    "transition",
                    isShuffle
                      ? "text-primary relative after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-primary after:rounded-full"
                      : "text-gray-400 hover:text-white",
                  )}
                >
                  <Shuffle className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-[#282828] text-white border-none rounded-md text-xs font-semibold px-3 py-1.5 mb-2"
              >
                <p>
                  {isShuffle
                    ? `Tắt trộn bài cho ${currentTrack.title}`
                    : `Bật trộn bài cho ${currentTrack.title}`}
                </p>
              </TooltipContent>
            </Tooltip>

            {/* Prev */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={playPrev}
                  className="text-gray-400 hover:text-white transition"
                >
                  <SkipBack className="w-5 h-5 fill-current" />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-[#282828] text-white border-none rounded-md text-xs font-semibold px-3 py-1.5 mb-2"
              >
                <p>Trước</p>
              </TooltipContent>
            </Tooltip>

            {/* Play/Pause */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={togglePlay}
                  className="w-8 h-8 flex items-center justify-center bg-white rounded-full text-black hover:scale-105 transition shadow-md"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current ml-1" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-[#282828] text-white border-none rounded-md text-xs font-semibold px-3 py-1.5 mb-2"
              >
                <p>{isPlaying ? "Tạm dừng" : "Phát"}</p>
              </TooltipContent>
            </Tooltip>

            {/* Next */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={playNext}
                  className="text-gray-400 hover:text-white transition"
                >
                  <SkipForward className="w-5 h-5 fill-current" />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-[#282828] text-white border-none rounded-md text-xs font-semibold px-3 py-1.5 mb-2"
              >
                <p>Tiếp theo</p>
              </TooltipContent>
            </Tooltip>

            {/* Repeat */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={toggleRepeat}
                  className={cn(
                    "transition",
                    repeatMode !== "off"
                      ? "text-primary relative after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-primary after:rounded-full"
                      : "text-gray-400 hover:text-white",
                  )}
                >
                  {repeatMode === "one" ? (
                    <Repeat1 className="w-4 h-4" />
                  ) : (
                    <Repeat className="w-4 h-4" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-[#282828] text-white border-none rounded-md text-xs font-semibold px-3 py-1.5 mb-2"
              >
                <p>
                  {repeatMode === "off"
                    ? "Bật lặp lại"
                    : repeatMode === "all"
                      ? "Bật lặp lại một bài"
                      : "Tắt lặp lại"}
                </p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 w-full text-xs text-gray-400 group">
            <span className="w-10 text-right">{formatTime(currentTime)}</span>

            <div className="relative flex-1 h-1 flex items-center">
              <div className="absolute left-0 right-0 h-1 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white group-hover:bg-primary transition-colors"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div
                className="absolute w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow transition-opacity z-10 pointer-events-none"
                style={{
                  left: `${progressPercent}%`,
                  transform: "translateX(-50%)",
                }}
              />
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="absolute inset-0 w-full opacity-0 cursor-pointer z-20"
              />
            </div>

            <span className="w-10">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 w-[30%] min-w-[150px]">
          {/* Queue */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={toggleQueue}
                className={cn(
                  "transition",
                  isQueueVisible
                    ? "text-primary relative after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-primary after:rounded-full"
                    : "text-gray-400 hover:text-white",
                )}
              >
                <ListMusic className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="bg-[#282828] text-white border-none rounded-md text-xs font-semibold px-3 py-1.5 mb-2"
            >
              <p>Danh sách chờ</p>
            </TooltipContent>
          </Tooltip>

          {/* Volume */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setVolume(volume === 0 ? 0.8 : 0)}
                className="text-gray-400 hover:text-white transition"
              >
                {volume === 0 ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="bg-[#282828] text-white border-none rounded-md text-xs font-semibold px-3 py-1.5 mb-2"
            >
              <p>{volume === 0 ? "Bật âm" : "Tắt âm"}</p>
            </TooltipContent>
          </Tooltip>

          <div className="relative w-24 h-1 flex items-center group">
            <div className="absolute left-0 right-0 h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white group-hover:bg-primary transition-colors"
                style={{ width: `${volumePercent}%` }}
              />
            </div>
            <div
              className="absolute w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow pointer-events-none z-10 transition-opacity"
              style={{
                left: `${volumePercent}%`,
                transform: "translateX(-50%)",
              }}
            />
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 appearance-none"
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
