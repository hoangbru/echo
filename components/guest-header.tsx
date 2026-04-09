"use client";

import { Search, Settings, UserIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface DBProfile {
  id: string;
  avatar?: string;
  fullName?: string;
  username?: string;
}

export function GuestHeader({ profile }: { profile: DBProfile | null }) {
  return (
    <header className="sticky top-0 z-30 w-full bg-background/80 backdrop-blur border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search songs, artists, albums..."
              className="w-full rounded-full bg-secondary px-4 py-2 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="hover:bg-primary/15 hover:text-primary transition-all duration-300 rounded-full"
          >
            <Link href="/profile">
              {profile ? (
                profile.avatar ? (
                  <Image
                    src={profile.avatar}
                    alt={profile.fullName || "Profile"}
                    width={32}
                    height={32}
                    className="rounded-full object-cover aspect-square"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-500/20 text-pink-500">
                    <span className="text-sm font-bold uppercase">
                      {(profile.username || profile.fullName || "U")[0]}
                    </span>
                  </div>
                )
              ) : (
                <UserIcon className="h-5 w-5" />
              )}
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            asChild
            className="hover:bg-primary/15 hover:text-primary transition-all duration-300 rounded-full"
          >
            <Link href="/settings">
              <Settings className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
