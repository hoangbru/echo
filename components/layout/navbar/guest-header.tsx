"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import {
  Settings,
  Crown,
  User as UserProfileIcon,
  Mic2,
  Shield,
  LogOut,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/features/guest/search";
import { ProBadge } from "@/components/shared/badge";
import ThemeSwitcher from "../theme-switcher";

import { UserProfile } from "@/types/user.type";
import { createClient } from "@/lib/supabase/client";
import { usePlayer } from "@/hooks/use-player";
import { PRO_THEMES } from "@/constants/themes";

interface GuestHeaderProps {
  profile: UserProfile | null;
  isArtist: boolean;
  isAdmin: boolean;
}

export function GuestHeader({ profile, isArtist, isAdmin }: GuestHeaderProps) {
  const supabase = createClient();
  const { resetPlayer, setIsAuthenticated } = usePlayer();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const menuRef = useRef<HTMLDivElement>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!mounted) return;

    if (theme && PRO_THEMES.includes(theme)) {
      if (!profile || !profile.isPremium) {
        setTheme("dark");
      }
    }
  }, [mounted, theme, profile, setTheme]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      setIsAuthenticated(false);
      setIsMenuOpen(false);
      resetPlayer();
      setTheme("dark");
      router.push("/");
      router.refresh();
      toast.success("Đã đăng xuất thành công!");
    } catch (error: any) {
      toast.error("Lỗi đăng xuất: " + error.message);
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-background/80 backdrop-blur border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex-1">
          <SearchInput />
        </div>

        {profile ? (
          <div className="flex items-center gap-4 relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center outline-none rounded-full transition-transform hover:scale-105 active:scale-95 relative"
            >
              <div
                className={`relative h-10 w-10 rounded-full ring-2 overflow-hidden flex-shrink-0 transition-all ${
                  isMenuOpen
                    ? "ring-primary shadow-sm shadow-primary/40"
                    : "ring-primary/30"
                }`}
              >
                {profile.avatar ? (
                  <Image
                    src={profile.avatar}
                    alt={profile.fullName || "Profile"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary to-purple-600 text-primary-foreground font-bold uppercase text-lg">
                    {(profile.fullName || profile.username || "U")[0]}
                  </div>
                )}
              </div>

              {profile.isPremium && (
                <div className="absolute bottom-0 -right-1 z-10">
                  <ProBadge />
                </div>
              )}
            </button>

            {isMenuOpen && (
              <div className="absolute top-full right-0 mt-3 w-72 bg-popover border border-border rounded-2xl shadow-xl py-2 z-50 origin-top-right animate-in fade-in zoom-in-95 duration-200">
                <div className="px-4 py-3 border-b border-border mb-2 flex items-center gap-3">
                  <div className="relative overflow-hidden h-12 w-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-primary-foreground font-bold uppercase text-xl flex-shrink-0">
                    {profile.avatar ? (
                      <Image
                        src={profile.avatar}
                        alt={profile.fullName || "Profile"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div>
                        {(profile.fullName || profile.username || "U")[0]}
                      </div>
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-foreground truncate">
                      {profile.fullName || profile.username}
                    </p>

                    {isAdmin ? (
                      <span className="text-xs font-bold text-primary flex items-center gap-1 mt-0.5">
                        <Shield className="w-3 h-3" /> Quản trị viên
                      </span>
                    ) : profile.isPremium ? (
                      <span className="text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
                        Premium Member
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Free Account
                      </span>
                    )}
                  </div>
                </div>

                {mounted && <ThemeSwitcher />}

                <div className="px-2 space-y-1">
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full px-3 py-2.5 mb-2 rounded-lg text-left flex items-center gap-3 bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20"
                    >
                      <Shield className="h-4 w-4" />
                      <span className="text-sm font-bold">
                        Khu vực Quản trị
                      </span>
                    </Link>
                  )}

                  {isArtist && !isAdmin && (
                    <Link
                      href="/studio/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full px-3 py-2.5 mb-2 rounded-lg text-left flex items-center gap-3 bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20"
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
                    className="w-full px-3 py-2.5 rounded-lg text-left flex items-center gap-3 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <UserProfileIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">Hồ sơ của tôi</span>
                  </Link>

                  {!isAdmin && !profile.isPremium ? (
                    <Link
                      href="/subscription"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full px-3 py-2.5 rounded-lg text-left flex items-center gap-3 text-primary hover:bg-primary/10 transition-colors"
                    >
                      <Crown className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Nâng cấp Premium
                      </span>
                    </Link>
                  ) : (
                    <Link
                      href="/subscription/manage"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full px-3 py-2.5 rounded-lg text-left flex items-center gap-3 text-primary hover:bg-primary/10 transition-colors"
                    >
                      <CreditCard className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Quản lý gói đăng ký
                      </span>
                    </Link>
                  )}

                  <Link
                    href="/settings"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full px-3 py-2.5 rounded-lg text-left flex items-center gap-3 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Cài đặt hệ thống
                    </span>
                  </Link>

                  {!isAdmin && !isArtist && (
                    <Link
                      href="/become-artist"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full px-3 py-2.5 rounded-lg text-left flex items-center gap-3 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <Mic2 className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Trở thành nghệ sĩ
                      </span>
                    </Link>
                  )}
                </div>

                <div className="mt-2 pt-2 border-t border-border px-2">
                  <button
                    onClick={handleLogout}
                    className="w-full px-3 py-2.5 rounded-lg text-left flex items-center gap-3 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm font-medium">Đăng xuất</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Button
              asChild
              className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 shadow-md shadow-primary/30"
            >
              <Link href="/auth/login">Đăng Nhập</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
