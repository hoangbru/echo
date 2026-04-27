"use client";

import { usePlayer } from "@/hooks/use-player";
import { cn } from "@/lib/utils/utils";
import Image from "next/image";
import { Play } from "lucide-react";
import DropdownTrackMenu from "./dropdown-track-menu";

export function QueuePanel() {
  const {
    queue,
    currentIndex,
    isQueueVisible,
    currentTrack,
    isPlaying,
    playTrack,
  } = usePlayer();

  if (!isQueueVisible || queue.length === 0) return null;

  const nextTracks = queue.slice(currentIndex + 1);

  return (
    <div
      className={cn(
        "fixed top-0 right-0 bottom-24 w-[350px] bg-[#121212] border-l border-white/5 z-50 overflow-y-auto p-4 shadow-2xl transition-transform duration-300 ease-in-out",
        isQueueVisible ? "translate-x-0" : "translate-x-full",
      )}
    >
      <div className="flex items-center justify-between mb-6 pt-2">
        <h2 className="text-white font-bold text-xl">Danh sách chờ</h2>
      </div>

      <div className="mb-8">
        <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">
          Đang phát
        </h3>
        {currentTrack && (
          <div className="flex items-center gap-3 p-2 rounded-md bg-white/5 cursor-pointer relative group">
            <div className="relative w-12 h-12 rounded overflow-hidden shrink-0 shadow-md">
              <Image
                src={currentTrack.imageUrl || "/default-cover.jpg"}
                alt={currentTrack.title}
                fill
                className="object-cover"
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="flex items-end gap-[2px] h-4">
                    <div className="w-1 bg-primary rounded-full h-3 animate-now-playing-bar-1" />
                    <div className="w-1 bg-primary rounded-full h-2 animate-now-playing-bar-2" />
                    <div className="w-1 bg-primary rounded-full h-4 animate-now-playing-bar-3" />
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-primary text-sm font-bold truncate">
                {currentTrack.title}
              </span>
              <span className="text-gray-400 text-xs truncate">
                {currentTrack.artistNames}
              </span>
            </div>

            <DropdownTrackMenu />
          </div>
        )}
      </div>

      {nextTracks.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">
            Tiếp theo
          </h3>
          <div className="flex flex-col gap-1">
            {nextTracks.map((track, idx) => (
              <div
                key={`${track.id}-${idx}`}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-white/10 cursor-pointer group transition-colors"
                onClick={() => playTrack(track)}
              >
                <div className="relative w-12 h-12 rounded overflow-hidden shrink-0 shadow-sm">
                  <Image
                    src={track.imageUrl || "/default-cover.jpg"}
                    alt={track.title}
                    fill
                    className="object-cover group-hover:opacity-30 transition"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <Play className="w-5 h-5 text-white fill-white" />
                  </div>
                </div>

                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-gray-200 text-sm font-medium truncate group-hover:text-white">
                    {track.title}
                  </span>
                  <span className="text-gray-500 text-xs truncate">
                    {track.artistNames}
                  </span>
                </div>

                <DropdownTrackMenu />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
