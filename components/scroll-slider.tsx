"use client";

import { useRef, ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ScrollSliderProps {
  children: ReactNode; // Thay vì nhận mảng và hàm, giờ nó nhận trực tiếp giao diện
}

export function ScrollSlider({ children }: ScrollSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative group">
      {/* Left Fade */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />

      {/* Right Fade */}
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />

      {/* Scroll Container */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto no-scrollbar scroll-smooth pb-4 px-8"
      >
        {/* Render trực tiếp children đã được Server tạo sẵn */}
        {children}
      </div>

      {/* Left Button */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/70 backdrop-blur p-2 rounded-full opacity-0 group-hover:opacity-100 transition z-20"
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>

      {/* Right Button */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/70 backdrop-blur p-2 rounded-full opacity-0 group-hover:opacity-100 transition z-20"
      >
        <ChevronRight className="w-5 h-5 text-white" />
      </button>
    </div>
  );
}
