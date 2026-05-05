"use client";

import { Play, Pause, Heart, MoreHorizontal, Clock } from "lucide-react";
import { usePlayer, PlayerTrack } from "@/hooks/use-player";
import { cn } from "@/lib/utils/utils";
import { formatDuration } from "@/lib/utils/format";

export function AlbumTrackList({
  album,
  tracks,
}: {
  album: any;
  tracks: any[];
}) {
  const { playTrack, togglePlay, currentTrack, isPlaying } = usePlayer();

  // Kiểm tra xem Album này có đang được phát không
  const isThisAlbumPlaying = currentTrack?.albumId === album.id;
  const isAlbumActuallyPlaying = isThisAlbumPlaying && isPlaying;

  const handlePlayAlbum = () => {
    if (tracks.length === 0) return;

    // Nếu đang phát album này rồi thì bấm là Tạm dừng
    if (isThisAlbumPlaying) {
      togglePlay();
      return;
    }

    // Map dữ liệu sang chuẩn Zustand
    const queue: PlayerTrack[] = tracks.map((t) => ({
      id: t.id,
      title: t.title,
      artistNames:
        t.trackArtists?.map((ta: any) => ta.artist.stageName).join(", ") ||
        album.artist?.stageName ||
        "Unknown Artist",
      imageUrl: t.imageUrl || album.coverImage || "/default-cover.jpg",
      audioUrl: t.audioUrl,
      albumId: album.id,
    }));

    // Phát bài đầu tiên và nạp nguyên list vào Queue
    playTrack(queue[0], queue);
  };

  const handlePlaySingleTrack = (track: any, index: number) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
      return;
    }

    const queue: PlayerTrack[] = tracks.map((t) => ({
      id: t.id,
      title: t.title,
      artistNames:
        t.trackArtists?.map((ta: any) => ta.artist.stageName).join(", ") ||
        album.artist?.stageName ||
        "Unknown Artist",
      imageUrl: t.imageUrl || album.coverImage || "/default-cover.jpg",
      audioUrl: t.audioUrl,
      albumId: album.id,
    }));

    playTrack(queue[index], queue);
  };

  return (
    <div className="pb-8">
      {/* --- ACTION BAR (Nút Play to, Nút Tim, 3 chấm) --- */}
      <div className="flex items-center gap-6 py-6">
        <button
          onClick={handlePlayAlbum}
          className="w-14 h-14 rounded-full bg-primary flex items-center justify-center hover:scale-105 transition-transform shadow-xl"
        >
          {isAlbumActuallyPlaying ? (
            <Pause className="w-6 h-6 text-black fill-black" />
          ) : (
            <Play className="w-6 h-6 text-black fill-black ml-1" />
          )}
        </button>

        <button className="text-gray-400 hover:text-white transition-colors">
          <Heart className="w-8 h-8" />
        </button>

        <button className="text-gray-400 hover:text-white transition-colors">
          <MoreHorizontal className="w-8 h-8" />
        </button>
      </div>

      {/* --- BẢNG DANH SÁCH BÀI HÁT --- */}
      <div className="mt-4">
        {/* Header của bảng */}
        <div className="grid grid-cols-[50px_minmax(0,1fr)_100px] md:grid-cols-[50px_minmax(0,2fr)_minmax(0,1fr)_100px] gap-4 px-4 py-2 border-b border-white/10 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
          <div className="text-center">#</div>
          <div>Tiêu đề</div>
          <div className="hidden md:block">Lượt nghe</div>
          <div className="flex justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        {/* Danh sách */}
        <div className="flex flex-col gap-1">
          {tracks.map((track, index) => {
            const isThisTrackPlaying = currentTrack?.id === track.id;
            const isActuallyPlaying = isThisTrackPlaying && isPlaying;

            return (
              <div
                key={track.id}
                className="group grid grid-cols-[50px_minmax(0,1fr)_100px] md:grid-cols-[50px_minmax(0,2fr)_minmax(0,1fr)_100px] gap-4 px-4 py-2.5 rounded-md hover:bg-white/10 transition-colors items-center cursor-pointer"
                onDoubleClick={() => handlePlaySingleTrack(track, index)}
              >
                {/* Cột 1: STT / Icon Play / Sóng nhạc */}
                <div className="text-center text-gray-400 text-sm font-medium relative w-full h-full flex items-center justify-center">
                  <span
                    className={cn(
                      "group-hover:opacity-0",
                      isThisTrackPlaying
                        ? "text-primary opacity-100"
                        : "opacity-100",
                    )}
                  >
                    {isActuallyPlaying ? (
                      // Icon sóng nhạc nếu đang phát
                      <div className="flex items-end gap-[2px] h-3">
                        <div className="w-[3px] bg-primary rounded-full h-3 animate-now-playing-bar-1" />
                        <div className="w-[3px] bg-primary rounded-full h-2 animate-now-playing-bar-2" />
                        <div className="w-[3px] bg-primary rounded-full h-3 animate-now-playing-bar-3" />
                      </div>
                    ) : (
                      index + 1
                    )}
                  </span>
                  {/* Hiện icon Play khi hover (Đè lên STT) */}
                  <button
                    onClick={() => handlePlaySingleTrack(track, index)}
                    className={cn(
                      "absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
                      isThisTrackPlaying && !isActuallyPlaying
                        ? "opacity-100 text-primary"
                        : "",
                    )}
                  >
                    {isThisTrackPlaying && !isActuallyPlaying ? (
                      <Play className="w-4 h-4 fill-primary text-primary" />
                    ) : (
                      <Play className="w-4 h-4 fill-white text-white" />
                    )}
                  </button>
                </div>

                {/* Cột 2: Tên bài & Ca sĩ */}
                <div className="flex flex-col min-w-0 pr-4">
                  <span
                    className={cn(
                      "text-base truncate font-medium",
                      isThisTrackPlaying ? "text-primary" : "text-white",
                    )}
                  >
                    {track.title}
                  </span>
                  <span className="flex items-center gap-2 text-sm text-gray-400 truncate group-hover:text-white transition-colors mt-0.5">
                    {/* Check nếu có cờ isExplicit thì hiện cục E này ra */}
                    {track.isExplicit && (
                      <span
                        className="inline-flex items-center justify-center w-[15px] h-[15px] bg-[#b3b3b3] text-[#121212] rounded-[2px] text-[10px] font-bold p-1"
                        title="Nội dung nhạy cảm (Explicit)"
                      >
                        E
                      </span>
                    )}
                    {track.trackArtists
                      ?.map((ta: any) => ta.artist.stageName)
                      .join(", ") ||
                      album.artist?.stageName ||
                      "Unknown Artist"}
                  </span>
                </div>

                {/* Cột 3: Lượt nghe (Ẩn trên mobile) */}
                <div className="hidden md:block text-sm text-gray-400 truncate">
                  {track.totalStreams?.toLocaleString() || "0"}
                </div>

                {/* Cột 4: Thời lượng */}
                <div className="text-sm text-gray-400 flex justify-center items-center gap-4">
                  <Heart className="w-4 h-4 opacity-0 group-hover:opacity-100 hover:text-white transition-all" />
                  {formatDuration(track.duration)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
