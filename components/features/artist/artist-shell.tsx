"use client";

import { ReactNode, useState } from "react";
import { Mic2 } from "lucide-react";

import { Sidebar } from "@/components/layout/sidebar";
import { ArtistHeader } from "@/components/layout/navbar";
import { MobileOverlay } from "@/components/layout";

import { Artist } from "@/types/artist.type";
import { artistMenuItems } from "@/constants/sidebar";

type ArtistShellProps = {
  children: ReactNode;
  profile: Artist;
};

export function ArtistShell({ children, profile }: ArtistShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#09090b] overflow-hidden">
      <Sidebar
        title="Echo Artist"
        logoIcon={Mic2}
        navItems={artistMenuItems}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <ArtistHeader
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
