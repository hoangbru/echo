"use client";

import {
  Search,
  UserIcon,
  LogOut,
  Settings,
  Crown,
  User as UserProfileIcon,
  Mic2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { User } from "@/types/user.type";

interface GuestHeaderProps {
  profile: User | null;
  isArtist: boolean;
}

export function GuestHeader({ profile, isArtist }: GuestHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/auth/login");
  };

  if (!profile) {
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
              asChild
              className="rounded-full bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 shadow-[0_0_15px_rgba(236,72,153,0.3)]"
            >
              <Link href="/auth/login">Đăng Nhập</Link>
            </Button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-30 w-full bg-[#09090b]/80 backdrop-blur border-b border-white/5">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex-1 max-w-md">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
            <input
              type="search"
              placeholder="Tìm kiếm bài hát, nghệ sĩ..."
              className="w-full rounded-full bg-card border border-white/10 px-4 py-2.5 pl-11 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center outline-none rounded-full transition-transform hover:scale-105 active:scale-95"
          >
            <div
              className={`relative h-10 w-10 rounded-full ring-2 overflow-hidden flex-shrink-0 transition-all ${isMenuOpen ? "ring-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.4)]" : "ring-pink-500/30"}`}
            >
              {profile.avatar ? (
                <Image
                  src={profile.avatar}
                  alt={profile.full_name || "Profile"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-pink-500 to-purple-600 text-white font-bold uppercase text-lg">
                  {(profile.full_name || profile.username || "U")[0]}
                </div>
              )}
            </div>
          </button>

          {isMenuOpen && (
            <div className="absolute top-full right-0 mt-3 w-64 bg-card border border-white/10 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.6)] py-2 z-50 origin-top-right animate-in fade-in zoom-in-95 duration-200">
              <div className="px-4 py-3 border-b border-white/5 mb-2 flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold uppercase text-xl flex-shrink-0">
                  {(profile.full_name || profile.username || "U")[0]}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-white truncate">
                    {profile.full_name || profile.username}
                  </p>
                  {profile.is_premium ? (
                    <span className="text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                      Premium Member
                    </span>
                  ) : (
                    <span className="text-xs text-gray-500">Free Account</span>
                  )}
                </div>
              </div>

              <div className="px-2 space-y-1">
                {isArtist && (
                  <Link
                    href="/artist/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full px-3 py-2.5 mb-2 rounded-lg text-left flex items-center gap-3 bg-pink-500/10 text-pink-500 hover:bg-pink-500/20 hover:text-pink-400 transition-colors border border-pink-500/20"
                  >
                    <Mic2 className="h-4 w-4" />
                    <span className="text-sm font-bold">
                      Khu vực Nghệ sĩ (Studio)
                    </span>
                  </Link>
                )}
                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full px-3 py-2.5 rounded-lg text-left flex items-center gap-3 text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <UserProfileIcon className="h-4 w-4" />
                  <span className="text-sm font-medium">Hồ sơ của tôi</span>
                </Link>

                {!profile.is_premium && (
                  <Link
                    href="/premium"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full px-3 py-2.5 rounded-lg text-left flex items-center gap-3 text-pink-400 hover:bg-pink-500/10 transition-colors"
                  >
                    <Crown className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Nâng cấp Premium
                    </span>
                  </Link>
                )}

                <Link
                  href="/settings"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full px-3 py-2.5 rounded-lg text-left flex items-center gap-3 text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  <span className="text-sm font-medium">Cài đặt hệ thống</span>
                </Link>

                <Link
                  href="/become-artist"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full px-3 py-2.5 rounded-lg text-left flex items-center gap-3 text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <Mic2 className="h-4 w-4" />
                  <span className="text-sm font-medium">Trở thành nghệ sĩ</span>
                </Link>
              </div>

              <div className="mt-2 pt-2 border-t border-white/5 px-2">
                <button
                  onClick={handleSignOut}
                  className="w-full px-3 py-2.5 rounded-lg text-left flex items-center gap-3 text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm font-medium">Đăng xuất</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
