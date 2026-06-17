"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  X,
  Home,
  Compass,
  Heart,
  ListMusic,
  TrendingUp,
  Plus,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils/helpers";

const navItems = [
  { label: "Trang chủ", icon: Home, href: "/" },
  { label: "Khám phá", icon: Compass, href: "/explore" },
  { label: "Trending", icon: TrendingUp, href: "/trending" },
  { label: "Tìm kiếm", icon: Search, href: "/search" },
];

const libraryItems = [
  { label: "Bài hát đã thích", icon: Heart, href: "/library/liked" },
  { label: "Playlists của bạn", icon: ListMusic, href: "/library/playlists" },
  // { label: "Albums đã lưu", icon: Music, href: "/library/albums" },
];

interface ListenerSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
}

export function ListenerSidebar({
  isOpen,
  onClose,
  isMobile = false,
}: ListenerSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "bg-sidebar border-border flex flex-col flex-shrink-0 z-50",
        isMobile
          ? "fixed inset-y-0 left-0 w-64 border-r transition-transform duration-300 lg:hidden"
          : "w-full lg:w-64 border-r h-full lg:h-screen lg:sticky lg:top-0 overflow-y-auto",
        isMobile && (isOpen ? "translate-x-0" : "-translate-x-full"),
      )}
    >
      <div className="p-6 border-b border-border flex items-center justify-between shrink-0">
        <Link href="/" className="flex items-center gap-2" onClick={onClose}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg">
            <Image
              src="/echo.png"
              alt="echo-logo"
              width={20}
              height={20}
              className="w-full object-cover"
            />
          </div>
          <span className="text-xl font-bold text-foreground">Echo</span>
        </Link>
        {isMobile && (
          <button
            onClick={onClose}
            className="lg:hidden text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={onClose}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200",
                    isActive &&
                      "text-primary bg-primary/10 border-l-2 border-primary shadow-[0_0_15px_hsl(var(--primary)/0.15)]",
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </div>

        <div className="px-4 py-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Thư viện
            </h3>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
              asChild
              onClick={onClose}
            >
              <Link href="/create">
                <Plus className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="space-y-2">
            {libraryItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} onClick={onClose}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200",
                      isActive &&
                        "text-primary bg-primary/10 border-l-2 border-primary shadow-[0_0_15px_hsl(var(--primary)/0.15)]",
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </aside>
  );
}
