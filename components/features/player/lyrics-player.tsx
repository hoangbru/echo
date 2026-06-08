"use client";

import { useMemo, useEffect, useRef, useState } from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { parseLRC } from "@/lib/utils/lyrics";
import { cn } from "@/lib/utils/helpers";
import { Mic2 } from "lucide-react";
import { usePlayer } from "@/hooks/use-player";

interface LyricsPlayerProps {
  currentTime: number;
}

export function LyricsPlayer({ currentTime }: LyricsPlayerProps) {
  const { currentTrack, isQueueVisible } = usePlayer();
  const [isOpen, setIsOpen] = useState(false);

  const lyricsData = useMemo(
    () => parseLRC(currentTrack?.lyrics || ""),
    [currentTrack],
  );

  const activeLineRef = useRef<HTMLDivElement>(null);

  const activeIndex = useMemo(() => {
    return lyricsData.findIndex((line, index) => {
      const nextLine = lyricsData[index + 1];
      return (
        currentTime >= line.time && (!nextLine || currentTime < nextLine.time)
      );
    });
  }, [currentTime, lyricsData]);

  useEffect(() => {
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeIndex]);

  if (!currentTrack) return null;

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className={cn(
              "transition-colors p-2",
              isOpen
                ? "text-primary relative after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-primary after:rounded-full"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Mic2 className="w-5 h-5" />
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="bg-popover text-popover-foreground border-border rounded-md text-xs font-semibold px-3 py-1.5 mb-2"
        >
          <p>Lời bài hát</p>
        </TooltipContent>
      </Tooltip>

      <Sheet open={isOpen} onOpenChange={setIsOpen} modal={false}>
        <SheetContent
          side="bottom"
          // FIX: Chặn Radix đóng sheet khi click/focus ra ngoài
          onInteractOutside={(e) => e.preventDefault()}
          onFocusOutside={(e) => e.preventDefault()}
          className={cn(
            "h-[85vh] bg-background border-border border-t rounded-t-[2rem] z-[100] pb-24 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]",
            isQueueVisible && "mr-[350px]",
          )}
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
            <div className="h-[400px] overflow-y-auto custom-scrollbar p-6 space-y-6">
              {lyricsData.length === 0 ? (
                <div className="text-muted-foreground italic text-center p-8">
                  (Bài hát này chưa có lời đồng bộ)
                </div>
              ) : (
                lyricsData.map((line, index) => {
                  const isActive = index === activeIndex;
                  const isPassed = index < activeIndex;

                  return (
                    <div
                      key={index}
                      ref={isActive ? activeLineRef : null}
                      className={cn(
                        "text-3xl font-bold transition-all duration-500 transform origin-left",
                        isActive
                          ? "text-primary scale-105"
                          : isPassed
                            ? "text-foreground opacity-60"
                            : "text-muted-foreground opacity-40 hover:opacity-80",
                      )}
                    >
                      {line.text}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
