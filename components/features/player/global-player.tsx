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
  Mic2,
} from "lucide-react";

import { LyricsPlayer } from ".";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { usePlayer } from "@/hooks/use-player";
import { cn } from "@/lib/utils/helpers";
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
      <div className="fixed bottom-0 left-0 right-0 h-24 bg-background border-t border-border px-4 flex items-center justify-between z-[110]">
        <audio
          ref={audioRef}
          src={currentTrack.audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
          onEnded={handleEnded}
        />

        {/* --- KHỐI BÊN TRÁI: THÔNG TIN BÀI HÁT --- */}
        <div className="flex items-center gap-4 w-[30%] min-w-[180px]">
          <div className="relative w-14 h-14 rounded-md overflow-hidden shrink-0 border border-border">
            <Image
              src={currentTrack.imageUrl || "/default-cover.jpg"}
              alt={currentTrack.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col truncate">
            <h4 className="text-foreground text-sm font-bold truncate hover:underline cursor-pointer tracking-tight">
              {currentTrack.title}
            </h4>
            <span className="text-muted-foreground text-xs truncate hover:underline cursor-pointer mt-0.5 font-medium">
              {currentTrack.artistNames}
            </span>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="ml-2 text-muted-foreground hover:text-foreground transition-transform active:scale-90"
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
              className="bg-popover text-popover-foreground border-border rounded-md text-xs font-semibold px-3 py-1.5 mb-2"
            >
              <p>{isLiked ? "Xóa khỏi Thư viện" : "Lưu vào Thư viện"}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* --- KHỐI GIỮA: CỤM ĐIỀU KHIỂN & PROGRESS BAR --- */}
        <div className="flex flex-col items-center max-w-[40%] w-full gap-2">
          <div className="flex items-center gap-6">
            {/* Shuffle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={toggleShuffle}
                  className={cn(
                    "transition-colors",
                    isShuffle
                      ? "text-primary relative after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-primary after:rounded-full"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Shuffle className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-popover text-popover-foreground border-border rounded-md text-xs font-semibold px-3 py-1.5 mb-2"
              >
                <p>{isShuffle ? "Tắt trộn bài" : "Bật trộn bài"}</p>
              </TooltipContent>
            </Tooltip>

            {/* Prev */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={playPrev}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <SkipBack className="w-5 h-5 fill-current" />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-popover text-popover-foreground border-border rounded-md text-xs font-semibold px-3 py-1.5 mb-2"
              >
                <p>Trước</p>
              </TooltipContent>
            </Tooltip>

            {/* Play/Pause */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={togglePlay}
                  className="w-8 h-8 flex items-center justify-center bg-foreground rounded-full text-background hover:scale-105 transition-transform shadow-md"
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
                className="bg-popover text-popover-foreground border-border rounded-md text-xs font-semibold px-3 py-1.5 mb-2"
              >
                <p>{isPlaying ? "Tạm dừng" : "Phát"}</p>
              </TooltipContent>
            </Tooltip>

            {/* Next */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={playNext}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <SkipForward className="w-5 h-5 fill-current" />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-popover text-popover-foreground border-border rounded-md text-xs font-semibold px-3 py-1.5 mb-2"
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
                    "transition-colors",
                    repeatMode !== "off"
                      ? "text-primary relative after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-primary after:rounded-full"
                      : "text-muted-foreground hover:text-foreground",
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
                className="bg-popover text-popover-foreground border-border rounded-md text-xs font-semibold px-3 py-1.5 mb-2"
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
          <div className="flex items-center gap-2 w-full text-xs text-muted-foreground font-medium group">
            <span className="w-10 text-right">{formatTime(currentTime)}</span>
            <div className="relative flex-1 h-1 flex items-center">
              <div className="absolute left-0 right-0 h-1 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-foreground group-hover:bg-primary transition-colors"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div
                className="absolute w-3 h-3 bg-foreground rounded-full opacity-0 group-hover:opacity-100 shadow-md transition-opacity z-10 pointer-events-none"
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
            <span className="w-10 text-left">{formatTime(duration)}</span>
          </div>
        </div>

        {/* --- KHỐI BÊN PHẢI: LỜI BÀI HÁT, QUEUE, VOLUME --- */}
        <div className="flex items-center justify-end gap-4 w-[30%] min-w-[150px]">
          {/* Lyrics */}
          <Sheet modal={false}>
            <Tooltip>
              <TooltipTrigger asChild>
                <SheetTrigger asChild>
                  <button className="text-muted-foreground hover:text-primary transition-colors p-2">
                    <Mic2 className="w-5 h-5" />
                  </button>
                </SheetTrigger>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-popover text-popover-foreground border-border rounded-md text-xs font-semibold px-3 py-1.5 mb-2"
              >
                <p>Lời bài hát</p>
              </TooltipContent>
            </Tooltip>

            <SheetContent
              side="bottom"
              className={`h-[85vh] bg-background border-border border-t rounded-t-[2rem] z-[100] ${isQueueVisible ? "mr-[350px]" : ""} pb-24 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]`}
            >
              <SheetHeader className="max-w-2xl mx-auto w-full">
                <div className="flex flex-col items-center gap-2 mb-4">
                  <div className="w-12 h-1.5 bg-muted rounded-full mb-4" />
                  <SheetTitle className="text-foreground text-center text-xl tracking-tight">
                    {currentTrack.title || "Đang phát"}
                  </SheetTitle>
                  <p className="text-primary text-sm font-semibold tracking-wide uppercase">
                    {currentTrack.artistNames || "Nghệ sĩ"}
                  </p>
                </div>
              </SheetHeader>

              <div className="max-w-3xl mx-auto h-full overflow-hidden">
                <LyricsPlayer
                  rawLyrics={currentTrack?.lyrics || ""}
                  currentTime={currentTime}
                />
              </div>
            </SheetContent>
          </Sheet>

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
          <div className="flex items-center gap-2 group">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setVolume(volume === 0 ? 0.8 : 0)}
                  className="text-muted-foreground hover:text-foreground transition-colors p-1"
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
                className="bg-popover text-popover-foreground border-border rounded-md text-xs font-semibold px-3 py-1.5 mb-2"
              >
                <p>{volume === 0 ? "Bật âm" : "Tắt âm"}</p>
              </TooltipContent>
            </Tooltip>

            {/* Range Volume */}
            <div className="relative w-20 h-1 flex items-center">
              <div className="absolute left-0 right-0 h-1 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-foreground group-hover:bg-primary transition-colors"
                  style={{ width: `${volumePercent}%` }}
                />
              </div>
              <div
                className="absolute w-3 h-3 bg-foreground rounded-full opacity-0 group-hover:opacity-100 shadow-md pointer-events-none z-10 transition-opacity"
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
      </div>
    </TooltipProvider>
  );
}
