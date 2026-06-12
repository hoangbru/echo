"use client";

import { useState, useEffect, useRef } from "react";
import {
  MoreHorizontal,
  Plus,
  User,
  Disc,
  Share2,
  Heart,
  ChevronRight,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlaylistSubmenu } from "./playlist-submenu";
import { useLikeTrack } from "@/hooks/use-like-track";
import { cn } from "@/lib/utils/helpers";
import { useRouter } from "next/navigation";
import { useTrackDetail } from "@/hooks/use-tracks";

interface DropdownTrackMenuProps {
  trackId: string;
  addedPlaylistIds?: string[];
}

export const DropdownTrackMenu = ({
  trackId,
  addedPlaylistIds = [],
}: DropdownTrackMenuProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    toggleLike,
    isLiked,
    isLoading: isLoadingLikeTrack,
  } = useLikeTrack(trackId);

  const { data: track, isLoading: isLoadingTrackDetail } =
    useTrackDetail(trackId);

  useEffect(() => {
    if (!open) setSubmenuOpen(false);
  }, [open]);

  const handleSubmenuEnter = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setSubmenuOpen(true);
  };

  const handleSubmenuLeave = () => {
    closeTimerRef.current = setTimeout(() => setSubmenuOpen(false), 150);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          onClick={(e) => e.stopPropagation()}
          className="text-muted-foreground hover:text-foreground p-2 opacity-0 group-hover:opacity-100 transition focus:outline-none"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56 bg-card border border-border text-foreground shadow-2xl p-1 rounded-md z-[110] overflow-visible"
        onCloseAutoFocus={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <div
          className="relative"
          onPointerEnter={handleSubmenuEnter}
          onPointerLeave={handleSubmenuLeave}
        >
          <DropdownMenuItem
            className="flex justify-start gap-2 items-center hover:bg-muted focus:bg-muted cursor-default p-3 text-sm font-medium transition-colors"
            onSelect={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setSubmenuOpen((prev) => !prev);
            }}
          >
            <Plus className="w-4 h-4" />
            <span className="flex justify-start items-center gap-2">
              Thêm vào playlist
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </span>
          </DropdownMenuItem>

          {submenuOpen && (
            <div
              className="absolute top-0 right-full pr-1 z-[120]"
              onPointerEnter={handleSubmenuEnter}
              onPointerLeave={handleSubmenuLeave}
            >
              <PlaylistSubmenu
                trackId={trackId}
                addedPlaylistIds={addedPlaylistIds}
              />
            </div>
          )}
        </div>

        <DropdownMenuItem
          disabled={isLoadingLikeTrack}
          onSelect={(e) => {
            e.stopPropagation();
            e.preventDefault();
            toggleLike();
          }}
          className="flex justify-start items-center gap-2 hover:bg-muted focus:bg-muted cursor-pointer p-3 text-sm font-medium transition-colors"
        >
          <Heart
            className={cn(
              "w-4 h-4 transition-all duration-300",
              isLiked
                ? "fill-primary text-primary scale-110"
                : "text-muted-foreground",
            )}
          />
          <span>{isLiked ? "Đã yêu thích" : "Yêu thích"}</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-border" />

        <DropdownMenuItem className="flex justify-start items-center gap-2 hover:bg-muted focus:bg-muted cursor-pointer p-3 text-sm font-medium transition-colors">
          <User className="w-4 h-4" />
          <span>Đi tới nghệ sĩ</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={(e) => {
            e.stopPropagation();
            router.push(`/album/${track?.albumId}`);
          }}
          className="flex justify-start items-center gap-2 hover:bg-muted focus:bg-muted cursor-pointer p-3 text-sm font-medium transition-colors"
        >
          <Disc className="w-4 h-4" />
          <span>Đi tới album</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-border" />

        <DropdownMenuItem className="flex justify-start items-center gap-2 hover:bg-muted focus:bg-muted cursor-pointer p-3 text-sm font-medium transition-colors">
          <Share2 className="w-4 h-4" />
          <span>Chia sẻ</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
