"use client";

import { ReactNode, useState, useEffect } from "react";

import { ListenerSidebar } from "@/components/layout/sidebar";
import { ListenerHeader } from "@/components/layout/navbar";
import { MobileOverlay } from "@/components/layout";

import { useAuth } from "@/hooks/use-auth";
import { usePlayer } from "@/hooks/use-player";
import { cn } from "@/lib/utils/helpers";

export function ListenerWrapper({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { isQueueVisible, setIsAuthenticated } = usePlayer();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user, setIsAuthenticated]);

  return (
    <div className="relative">
      <div className="flex h-screen bg-background flex-col lg:flex-row overflow-hidden">
        {/* SIDEBAR DESKTO */}
        <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
          <ListenerSidebar />
        </div>

        {/* SIDEBAR MOBILE */}
        <ListenerSidebar
          isMobile
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <div
          className={cn(
            "flex-1 flex flex-col min-w-0 h-full transition-all duration-300 ease-in-out",
            isQueueVisible ? "xl:mr-[350px]" : "mr-0",
          )}
        >
          <ListenerHeader onOpenSidebar={() => setIsSidebarOpen(true)} />

          <main className="flex-1 overflow-y-auto pb-32">
            <div className="min-h-screen bg-background">{children}</div>
          </main>
        </div>
      </div>

      <MobileOverlay
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </div>
  );
}
