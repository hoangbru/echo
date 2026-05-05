"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, LogOut, LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils/utils";
import { SidebarItem } from "@/constants/sidebar";

interface SidebarProps {
  title: string;
  logoIcon: LucideIcon;
  navItems: SidebarItem[];
  isOpen: boolean;
  onClose: () => void;
  backToAppHref?: string;
}

export function Sidebar({
  title,
  logoIcon: LogoIcon,
  navItems,
  isOpen,
  onClose,
  backToAppHref = "/",
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transition-transform lg:relative lg:translate-x-0 flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div className="p-6 border-b border-border flex items-center justify-between shrink-0">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-blue-600">
            <LogoIcon className="w-5 h-5 text-white" />
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

      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href} onClick={onClose}>
              <button
                className={cn(
                  "w-full flex items-center justify-between gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors mb-1",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-secondary",
                )}
              >
                <span className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "w-5 h-5",
                      isActive
                        ? "text-primary-foreground"
                        : "group-hover:text-primary",
                    )}
                  />
                  {item.label}
                </span>
                {item.badge && (
                  <span className="bg-primary text-primary-foreground text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[20px] border border-background">
                    {item.badge}
                  </span>
                )}
              </button>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border shrink-0">
        <Button
          variant="outline"
          className="w-full gap-2 border-border text-muted-foreground hover:text-foreground rounded-xl"
          asChild
        >
          <Link href={backToAppHref}>
            <LogOut className="h-4 w-4" />
            Quay lại Echo
          </Link>
        </Button>
      </div>
    </aside>
  );
}
