"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu, LogOut, ChevronDown, Settings } from "lucide-react";

import { AdminProfileType } from "@/components/features/admin";
import { createClient } from "@/lib/supabase/client";

interface AdminHeaderProps {
  onOpenSidebar: () => void;
  adminProfile: AdminProfileType;
}

export function AdminHeader({ onOpenSidebar, adminProfile }: AdminHeaderProps) {
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin-login");
    router.refresh();
  };

  return (
    <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden text-muted-foreground hover:text-foreground transition"
          aria-label="Open sidebar"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-bold text-foreground hidden sm:block">
          Admin Panel
        </h1>
      </div>

      <div className="relative flex items-center gap-4" ref={menuRef}>
        <div className="hidden md:flex flex-col items-end">
          <span className="text-sm font-medium text-foreground">
            {adminProfile.fullName}
          </span>
          <span className="text-xs text-muted-foreground">
            {adminProfile.email}
          </span>
        </div>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center gap-2 group outline-none"
        >
          <div className="relative h-10 w-10 rounded-full ring-2 ring-primary/50 overflow-hidden flex-shrink-0 transition-all group-hover:ring-primary">
            {adminProfile.avatar ? (
              <Image
                src={adminProfile.avatar}
                alt="Admin Avatar"
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground font-bold uppercase">
                {adminProfile.fullName[0]}
              </div>
            )}
          </div>

          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-all duration-300 group-hover:text-foreground ${isMenuOpen ? "rotate-180 text-foreground" : ""}`}
          />
        </button>

        {isMenuOpen && (
          <div className="absolute top-full right-0 mt-3 w-56 bg-popover border border-border rounded-xl shadow-2xl py-2 z-50 origin-top-right animate-in fade-in zoom-in-95 duration-200">
            <div className="px-4 py-2 border-b border-border mb-2 md:hidden">
              <p className="text-sm font-medium text-foreground truncate">
                {adminProfile.fullName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {adminProfile.email}
              </p>
            </div>

            <button className="w-full px-4 py-2.5 text-left flex items-center gap-3 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
              <Settings className="h-4 w-4" />
              <span className="text-sm font-medium">Cài đặt tài khoản</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full px-4 py-2.5 text-left flex items-center gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors mt-1"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-medium">Đăng xuất</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
