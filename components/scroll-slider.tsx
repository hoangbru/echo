"use client";

import { useRef, ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/utils";

interface ScrollSliderProps {
  children: ReactNode;
  className?: string;
}

export function ScrollSlider({ children, className }: ScrollSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 400;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className={cn("relative group w-full", className)}>
      <div
        ref={scrollRef}
        className={cn(
          "flex gap-5 overflow-x-auto no-scrollbar scroll-smooth pb-4 px-2",
          "[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]",
        )}
      >
        {children}
      </div>

      <button
        onClick={() => scroll("left")}
        className="absolute left-[-15px] top-1/2 -translate-y-1/2 bg-background/80 border border-primary/20 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-primary hover:text-white z-30 shadow-[0_0_15px_rgba(255,26,140,0.3)]"
        aria-label="Scroll Left"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={() => scroll("right")}
        className="absolute right-[-15px] top-1/2 -translate-y-1/2 bg-background/80 border border-primary/20 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-primary hover:text-white z-30 shadow-[0_0_15px_rgba(255,26,140,0.3)]"
        aria-label="Scroll Right"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
