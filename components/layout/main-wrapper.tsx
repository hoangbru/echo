"use client";

import { usePlayer } from "@/hooks/use-player";
import { cn } from "@/lib/utils/utils";

export function MainWrapper({ children }: { children: React.ReactNode }) {
  const { isQueueVisible } = usePlayer();

  return (
    <main
      className={cn(
        "transition-all duration-300 ease-in-out h-full",
        isQueueVisible ? "mr-[350px]" : "mr-0",
      )}
    >
      {children}
    </main>
  );
}
