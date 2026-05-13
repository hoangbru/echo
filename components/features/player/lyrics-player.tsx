"use client";

import { useMemo, useEffect, useRef } from "react";
import { parseLRC, LyricLine } from "@/lib/utils/lyrics";
import { cn } from "@/lib/utils/helpers";

interface LyricsPlayerProps {
  rawLyrics: string; // Chuỗi LRC từ DB
  currentTime: number; // Thời gian hiện tại của bài hát (nhận từ GlobalPlayer)
}

export function LyricsPlayer({ rawLyrics, currentTime }: LyricsPlayerProps) {
  // 1. Chỉ Parse 1 lần duy nhất khi rawLyrics thay đổi
  const lyricsData = useMemo(() => parseLRC(rawLyrics), [rawLyrics]);

  // Ref để auto-scroll tới câu hát đang phát
  const activeLineRef = useRef<HTMLDivElement>(null);

  // 2. Tìm index của câu hát hiện tại
  // Một câu được xem là "Active" nếu currentTime >= thời gian của nó
  // VÀ currentTime < thời gian của câu tiếp theo.
  const activeIndex = useMemo(() => {
    return lyricsData.findIndex((line, index) => {
      const nextLine = lyricsData[index + 1];
      return (
        currentTime >= line.time && (!nextLine || currentTime < nextLine.time)
      );
    });
  }, [currentTime, lyricsData]);

  // 3. Hiệu ứng tự động cuộn (Auto-scroll) mượt mà
  useEffect(() => {
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center", // Cuộn sao cho câu hát nằm ở giữa màn hình
      });
    }
  }, [activeIndex]);

  if (lyricsData.length === 0) {
    return (
      <div className="text-muted-foreground italic text-center p-8">
        (Bài hát này chưa có lời đồng bộ)
      </div>
    );
  }

  return (
    <div className="h-[400px] overflow-y-auto custom-scrollbar p-6 space-y-6">
      {lyricsData.map((line, index) => {
        const isActive = index === activeIndex;
        const isPassed = index < activeIndex; // Những câu đã hát qua

        return (
          <div
            key={index}
            ref={isActive ? activeLineRef : null} // Gắn ref vào câu hiện tại
            className={cn(
              "text-3xl font-bold transition-all duration-500 transform origin-left",
              isActive
                ? "text-primary scale-105" // Câu đang hát: Màu nhấn (Hồng), to ra một chút
                : isPassed
                  ? "text-foreground opacity-60" // Câu đã qua: Màu trắng giảm mờ
                  : "text-muted-foreground opacity-40 hover:opacity-80", // Câu chưa tới: Màu xám mờ
            )}
          >
            {line.text}
          </div>
        );
      })}
    </div>
  );
}
