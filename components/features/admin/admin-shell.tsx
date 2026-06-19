"use client";

import { ReactNode, useState, useMemo } from "react";
import { LayoutDashboard } from "lucide-react";

import { AdminHeader } from "@/components/layout/navbar";
import { DashboardSidebar } from "@/components/layout/sidebar";
import { MobileOverlay } from "@/components/layout";

import { adminMenuItems } from "@/constants/sidebar";
import { useAdminBadges } from "@/hooks/use-admin";

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

  const { data: badges } = useAdminBadges();

  const dynamicNavItems = useMemo(() => {
    return adminMenuItems.map((item) => {
      if (item.href === "/admin/artist-requests") {
        return {
          ...item,
          badge:
            badges?.pendingRequests > 0 ? badges.pendingRequests : undefined,
        };
      }
      if (item.href === "/admin/reports") {
        return {
          ...item,
          badge: badges?.pendingReports > 0 ? badges.pendingReports : undefined,
        };
      }
      return { ...item, badge: undefined };
    });
  }, [badges]);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <DashboardSidebar
        title="Echo Admin"
        logoIcon={LayoutDashboard}
        navItems={dynamicNavItems}
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
