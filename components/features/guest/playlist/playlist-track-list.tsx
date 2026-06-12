"use client";

import { MouseEvent } from "react";
import { Clock, Play, Trash2 } from "lucide-react";
import { PlaylistDetail } from "@/types/playlist.type";
import { formatDate, formatDuration } from "@/lib/utils/format";

interface PlaylistTrackListProps {
  playlist: PlaylistDetail;
  tracks: PlaylistDetail["tracks"];
  onDeleteTrack: (id: string) => void;
}

export function PlaylistTrackList({
  playlist,
  tracks,
  onDeleteTrack,
}: PlaylistTrackListProps) {
  return (
    <div className="mt-6">
      {/* Header Grid */}
      <div className="grid grid-cols-[16px_4fr_3fr_2fr_minmax(120px,_1fr)] gap-4 px-4 py-2 border-b border-border text-[14px] text-muted-foreground font-medium mb-2">
        <div className="text-center">#</div>
        <div>Tiêu đề</div>
        <div>Album</div>
        <div>Ngày thêm</div>
        <div className="flex justify-end pr-8">
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
          tracks.map((track, index) => (
            <div
              key={track.id}
              className="grid grid-cols-[16px_4fr_3fr_2fr_minmax(120px,_1fr)] gap-4 px-4 py-3 rounded-md hover:bg-accent hover:text-accent-foreground group items-center transition-colors text-[14px]"
            >
              {/* STT & Nút Play */}
              <div className="flex items-center justify-center text-muted-foreground group-hover:text-foreground">
                <span className="group-hover:hidden">{index + 1}</span>
                <Play className="w-4 h-4 text-foreground fill-foreground hidden group-hover:block cursor-pointer hover:scale-110 transition-transform" />
              </div>

              {/* Thông tin Bài hát */}
              <div className="flex items-center gap-3">
                <img
                  src={track.imageUrl || "/default-cover.jpg"}
                  alt={track.title}
                  className="w-10 h-10 object-cover rounded-md shadow-sm"
                />
                <div className="overflow-hidden">
                  <p className="text-foreground font-medium truncate group-hover:text-primary cursor-pointer transition-colors">
                    {track.title}
                  </p>
                  <p className="text-muted-foreground text-[13px] truncate">
                    {track.artists?.map((a: any) => a.stageName).join(", ") ||
                      "Unknown Artist"}
                  </p>
                </div>
              </div>

              {/* Tên Album */}
              <div className="text-muted-foreground truncate hover:text-foreground cursor-pointer transition-colors">
                {(track as any).album?.title || "Đơn khúc"}
              </div>

              <div className="text-muted-foreground group-hover:text-foreground/80 transition-colors">
                {formatDate(track.addedAt)}
              </div>

              {/* Thời lượng & Nút Xóa */}
              <div className="flex items-center justify-end gap-4 text-muted-foreground group-hover:text-foreground pr-4 transition-colors">
                <span className="text-[13px]">
                  {formatDuration((track as any).duration)}
                </span>

                <button
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    onDeleteTrack(track.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive/80 transition-all hover:scale-110 ml-2"
                  title="Xóa khỏi danh sách phát"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
