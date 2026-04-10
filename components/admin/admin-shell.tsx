"use client";

import { useState } from "react";
import { AdminSidebar } from "./admin-sidebar";
import { AdminHeader } from "./admin-header";
import { AdminMobileOverlay } from "./admin-mobile-overlay";

export interface AdminProfileType {
  fullName: string;
  avatar: string | null;
  email: string | undefined;
}

export function AdminShell({
  children,
  adminProfile,
}: {
  children: React.ReactNode;
  adminProfile: AdminProfileType;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          onOpenSidebar={() => setSidebarOpen(true)}
          adminProfile={adminProfile}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>

      <AdminMobileOverlay
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
    </div>
  );
}
