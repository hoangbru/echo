"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  Plus,
  User,
  Disc,
  Share2,
  Heart,
  ChevronRight,
  Flag,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlaylistSubmenu } from "./playlist-submenu";
import { ReportDialog } from "@/components/shared";

import { useLikeTrack } from "@/hooks/use-like-track";
import { cn } from "@/lib/utils/helpers";
import { TrackDetail } from "@/types";
import { useTrackPlaylists } from "@/hooks/use-playlists";

interface DropdownTrackMenuProps {
  track: TrackDetail;
}

export const DropdownTrackMenu = ({ track }: DropdownTrackMenuProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    toggleLike,
    isLiked,
    isLoading: isLoadingLikeTrack,
  } = useLikeTrack(track.id, open);

  const { data: trackPlaylistsData } = useTrackPlaylists(track.id, open);
  const addedPlaylistIds = trackPlaylistsData || [];

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
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button
            onClick={(e) => e.stopPropagation()}
            className="text-muted-foreground hover:text-foreground p-2 opacity-0 group-hover:opacity-100 transition focus:outline-none"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuPortal>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-card border border-border text-foreground shadow-2xl p-1 rounded-md z-[9999] overflow-visible"
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
                  className="absolute top-0 right-full pr-1 z-[10000]"
                  onPointerEnter={handleSubmenuEnter}
                  onPointerLeave={handleSubmenuLeave}
                >
                  <PlaylistSubmenu
                    trackId={track.id}
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

            <DropdownMenuItem
              onSelect={(e) => {
                e.stopPropagation();
                const mainArtistId = track.artists?.[0]?.id || track.artistId;
                router.push(`/artist/${mainArtistId}`);
              }}
              className="flex justify-start items-center gap-2 hover:bg-muted focus:bg-muted cursor-pointer p-3 text-sm font-medium transition-colors"
            >
              <User className="w-4 h-4" />
              <span>Đi tới nghệ sĩ</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={(e) => {
                e.stopPropagation();
                const albumId = track.album.id || track.albumId;
                router.push(`/album/${albumId}`);
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

            <DropdownMenuItem
              onSelect={(e) => {
                e.stopPropagation();
                setIsReportOpen(true);
              }}
              className="flex justify-start items-center gap-2 hover:bg-destructive/10 focus:bg-destructive/10 text-destructive focus:text-destructive cursor-pointer p-3 text-sm font-medium transition-colors"
            >
              <Flag className="w-4 h-4" />
              <span>Báo cáo vi phạm</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>

      <ReportDialog
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        targetId={track.id}
        targetName={track.title}
        targetType="TRACK"
      />
    </>
  );
};
