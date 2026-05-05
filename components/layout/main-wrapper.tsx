"use client";

import { usePlayer } from "@/hooks/use-player";
import { cn } from "@/lib/utils/utils";
import { ReactNode } from "react";

export function MainWrapper({ children }: { children: ReactNode }) {
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
