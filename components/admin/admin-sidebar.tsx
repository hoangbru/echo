"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Music,
  Users,
  FileUp,
  BarChart3,
  CheckCircle,
  X,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { Button } from "@/components/ui/button";
import { adminNavItems } from "@/constants/admin-nav";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transition-transform lg:relative lg:translate-x-0 flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      {/* Logo */}
      <div className="p-6 border-b border-border flex items-center justify-between shrink-0">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-blue-600">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-foreground">Echo Admin</span>
        </Link>
        <button
          onClick={onClose}
          className="lg:hidden text-muted-foreground hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {adminNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <button
                onClick={onClose}
                className={cn(
                  "w-full flex items-center justify-between gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors mb-1",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-secondary",
                )}
              >
                <span className="flex items-center gap-3">
                  {item.icon}
                  {item.label}
                </span>
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border shrink-0">
        <Button variant="outline" className="w-full gap-2" asChild>
          <Link href="/">
            <LogOut className="h-4 w-4" />
            Back to App
          </Link>
        </Button>
      </div>
    </aside>
  );
}
