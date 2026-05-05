"use client";

import { ReactNode, useState } from "react";
import { LayoutDashboard } from "lucide-react";

import { AdminHeader } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileOverlay } from "@/components/layout";

import { adminMenuItems } from "@/constants/sidebar";

export interface AdminProfileType {
  fullName: string;
  avatar: string | null;
  email: string | undefined;
}

export function AdminShell({
  children,
  adminProfile,
}: {
  children: ReactNode;
  adminProfile: AdminProfileType;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        title="Echo Admin"
        logoIcon={LayoutDashboard}
        navItems={adminMenuItems}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          adminProfile={adminProfile}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>

      <MobileOverlay
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </div>
  );
}
