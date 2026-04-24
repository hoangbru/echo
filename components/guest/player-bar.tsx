"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Repeat,
  Shuffle,
  Mic2,
  ListMusic,
  MonitorSpeaker,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

import { usePlayer } from "@/lib/contexts/player-context";

export function PlayerBar() {
  const {
    state,
    pause,
    resume,
    next,
    previous,
    toggleShuffle,
    setRepeat,
    setVolume,
    seek,
  } = usePlayer();

  if (!state.currentTrack) return null;

  const handlePlayPause = () => (state.isPlaying ? pause() : resume());

  const handleToggleRepeat = () => {
    const modes: ("off" | "all" | "one")[] = ["off", "all", "one"];
    const nextMode = modes[(modes.indexOf(state.repeat) + 1) % modes.length];
    setRepeat(nextMode);
  };

  const formatTime = (seconds: number) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 border-t border-[#262626] px-4 h-[90px] grid grid-cols-3 items-center backdrop-blur-md">
      {/* 1. Track Info: Luôn nằm bên trái */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-md shadow-lg group">
          <Image
            src={state.currentTrack.image_url || "/placeholder-track.png"}
            alt={state.currentTrack.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col min-w-0">
          <Link
            href={`/track/${state.currentTrack.id}`}
            className="text-sm font-medium text-white hover:underline truncate"
          >
            {state.currentTrack.title}
          </Link>
          <p className="text-xs text-[#B3B3B3] hover:text-white cursor-pointer truncate">
            {state.currentTrack.artist?.stage_name}
          </p>
        </div>
      </div>

      {/* 2. Player Controls: Trọng tâm của giao diện */}
      <div className="flex flex-col items-center max-w-[722px] w-full gap-1">
        <div className="flex items-center gap-5">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleShuffle}
            className={`hover:text-white transition ${state.shuffle ? "text-[#FF1A8C]" : "text-[#B3B3B3]"}`}
          >
            <Shuffle className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={previous}
            className="text-[#B3B3B3] hover:text-white"
          >
            <SkipBack className="h-5 w-5 fill-current" />
          </Button>

          <Button
            size="icon"
            onClick={handlePlayPause}
            className="bg-white hover:scale-105 transition text-black rounded-full h-8 w-8 p-0"
          >
            {state.isPlaying ? (
              <Pause className="h-5 w-5 fill-current" />
            ) : (
              <Play className="h-5 w-5 fill-current ml-0.5" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={next}
            className="text-[#B3B3B3] hover:text-white"
          >
            <SkipForward className="h-5 w-5 fill-current" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleRepeat}
            className={`hover:text-white transition ${state.repeat !== "off" ? "text-[#FF1A8C]" : "text-[#B3B3B3]"}`}
          >
            <Repeat className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress Slider */}
        <div className="flex items-center gap-2 w-full">
          <span className="text-[10px] text-[#B3B3B3] min-w-[30px] text-right">
            {formatTime(state.currentTime)}
          </span>
          <Slider
            value={[state.currentTime]}
            max={state.currentTrack.duration || 100}
            step={0.1}
            onValueChange={(val) => seek(val[0])}
            className="flex-1"
            // Lưu ý: Cần tùy chỉnh CSS của Slider shadcn để có màu hồng #FF1A8C khi active
          />
          <span className="text-[10px] text-[#B3B3B3] min-w-[30px]">
            {formatTime(state.currentTrack.duration)}
          </span>
        </div>
      </div>

      {/* 3. Utility Controls: Bên phải */}
      <div className="flex items-center justify-end gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="text-[#B3B3B3] hover:text-white hidden lg:flex"
        >
          <Mic2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-[#B3B3B3] hover:text-white hidden lg:flex"
        >
          <ListMusic className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2 w-32">
          <Volume2 className="h-4 w-4 text-[#B3B3B3]" />
          <Slider
            value={[state.volume * 100]}
            max={100}
            onValueChange={(v) => setVolume(v[0] / 100)}
          />
        </div>
      </div>
    </div>
  );
}
