"use client";

import { Heart } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { cn } from "@/lib/utils/helpers";
import { useLikeTrack } from "@/hooks/use-like-track";
import { usePlayer } from "@/hooks/use-player";

interface LikeButtonProps {}

export function LikeButton({}: LikeButtonProps) {
  const { currentTrack } = usePlayer();
  const { toggleLike, isLiked, isLoading } = useLikeTrack(
    currentTrack?.id || "",
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={toggleLike}
          disabled={isLoading}
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
  );
}
