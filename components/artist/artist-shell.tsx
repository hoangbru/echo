"use client";

import { useState } from "react";
import { ArtistSidebar } from "./artist-sidebar";
import { ArtistHeader } from "./artist-header";

export function ArtistShell({
  children,
  profile,
}: {
  children: React.ReactNode;
  profile: any;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#09090b] overflow-hidden">
      <ArtistSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <ArtistHeader
          profile={profile}
          onOpenSidebar={() => setSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
