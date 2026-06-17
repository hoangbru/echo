"use client";

import { ReactNode, useState } from "react";
import { Mic2 } from "lucide-react";

import { DashboardSidebar } from "@/components/layout/sidebar";
import { StudioHeader } from "@/components/layout/navbar";
import { MobileOverlay } from "@/components/layout";

import { Artist } from "@/types/artist.type";
import { artistMenuItems } from "@/constants/sidebar";

type StudioShellProps = {
  children: ReactNode;
  profile: Artist;
};

export function StudioShell({ children, profile }: StudioShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <DashboardSidebar
        title="Echo Artist"
        logoIcon={Mic2}
        navItems={artistMenuItems}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <StudioHeader
          profile={profile}
          onOpenSidebar={() => setIsSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>

      <MobileOverlay
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </div>
  );
}
