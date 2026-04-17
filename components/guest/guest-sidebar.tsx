"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Compass,
  Heart,
  Music,
  ListMusic,
  TrendingUp,
  Radio,
  LogOut,
  Plus,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { Button } from "@/components/ui/button";
import { usePlayer } from "@/lib/contexts/player-context";

const navItems = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Explore", icon: Compass, href: "/explore" },
  { label: "Trending", icon: TrendingUp, href: "/trending" },
  { label: "Search", icon: Search, href: "/search" },
];

const libraryItems = [
  { label: "Liked Songs", icon: Heart, href: "/library/liked" },
  { label: "Your Playlists", icon: ListMusic, href: "/library/playlists" },
  { label: "Saved Albums", icon: Music, href: "/library/albums" },
];

export function GuestSidebar() {
  const pathname = usePathname();
  const { state } = usePlayer();

  return (
    <aside className="w-full lg:w-64 bg-background border-r border-border flex flex-col h-full lg:h-screen lg:sticky lg:top-0 overflow-y-auto">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-blue-600">
            <Music className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-foreground">Echo</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-200",
                    isActive &&
                      "text-primary bg-gradient-to-r from-primary/20 to-primary/5 border-l-2 border-primary shadow-[0_0_15px_hsl(var(--primary)/0.3)]",
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </div>

        {/* Library Section */}
        <div className="px-4 py-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Library
            </h3>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-foreground hover:text-primary"
              asChild
            >
              <Link href="/library/create">
                <Plus className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="space-y-2">
            {libraryItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-200",
                      isActive &&
                        "text-primary bg-gradient-to-r from-primary/20 to-primary/5 border-l-2 border-primary shadow-[0_0_15px_hsl(var(--primary)/0.3)]",
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

      {/* Now Playing Info */}
      {state.currentTrack && (
        <div className="border-t border-border p-4 bg-card">
          <div className="text-xs text-muted-foreground mb-2">Now Playing</div>
          <Link href={`/track/${state.currentTrack.id}`}>
            <div className="bg-secondary rounded p-2 hover:bg-accent transition">
              <p className="text-sm font-semibold truncate text-foreground">
                {state.currentTrack.title}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {state.currentTrack.artist}
              </p>
            </div>
          </Link>
        </div>
      )}
    </aside>
  );
}
