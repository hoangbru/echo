"use client";

import { useFollowArtist } from "@/hooks/use-follow";
import { Play, MoreHorizontal, Loader2 } from "lucide-react";

interface ActionButtonsProps {
  artistId: string;
  onPlayClick?: () => void;
}

export function ActionButtons({ artistId, onPlayClick }: ActionButtonsProps) {
  // Gọi hook quản lý trạng thái follow
  const { isFollowing, toggleFollow, isLoading } = useFollowArtist(artistId);

  return (
    <div className="px-8 py-6 flex items-center gap-6">
      {/* Nút Play (Phát danh sách phổ biến) */}
      <button
        onClick={onPlayClick}
        className="w-14 h-14 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors focus:ring-2 focus:ring-ring focus:outline-none shadow-lg shadow-primary/20"
      >
        <Play className="text-primary-foreground w-6 h-6 fill-current ml-0.5" />
      </button>

      {/* Nút Follow (Có thay đổi giao diện theo trạng thái) */}
      <button
        onClick={toggleFollow}
        disabled={isLoading}
        // min-w-[120px] giúp nút không bị giật/thay đổi kích thước khi chữ đổi từ "Theo Dõi" sang "Đang Theo Dõi"
        className={`border rounded-full px-4 py-1.5 text-[14px] font-semibold transition-colors flex items-center justify-center min-w-[125px] ${
          isFollowing
            ? "border-foreground text-foreground hover:border-muted-foreground hover:text-muted-foreground" // UI khi đã Follow
            : "border-border text-foreground hover:border-foreground" // UI khi chưa Follow
        }`}
      >
        {/* Nếu đang fetch API lần đầu (chưa có data), hiển thị icon xoay xoay */}
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isFollowing ? (
          "Đang Theo Dõi"
        ) : (
          "Theo Dõi"
        )}
      </button>

      {/* Nút More Options */}
      <button className="text-muted-foreground hover:text-foreground transition-colors">
        <MoreHorizontal className="w-7 h-7" />
      </button>
    </div>
  );
}

export function ActionButtonsSkeleton() {
  return (
    <div className="px-8 py-6 flex items-center gap-6 animate-pulse">
      <div className="w-14 h-14 rounded-full bg-muted/50" />

      <div className="w-24 h-9 rounded-full bg-muted/40" />

      <div className="w-7 h-7 rounded-full bg-muted/40" />
    </div>
  );
}
