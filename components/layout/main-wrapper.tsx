"use client";

import { ReactNode, useEffect } from "react";

import { useAuth } from "@/hooks/use-auth";
import { usePlayer } from "@/hooks/use-player";
import { cn } from "@/lib/utils/helpers";

export function MainWrapper({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { isQueueVisible, setIsAuthenticated } = usePlayer();

  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user, setIsAuthenticated]);

  return (
    <main
      className={cn(
        "transition-all duration-300 ease-in-out h-full",
        isQueueVisible ? "mr-[350px]" : "mr-0",
      )}
    >
      <div className="min-h-screen bg-background">{children}</div>
    </main>
  );
}
