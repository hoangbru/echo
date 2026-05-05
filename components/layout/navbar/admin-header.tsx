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
    <header className="bg-card border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden text-gray-400 hover:text-white transition"
          aria-label="Open sidebar"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-bold text-white hidden sm:block">
          Admin Panel
        </h1>
      </div>

      <div className="relative flex items-center gap-4" ref={menuRef}>
        <div className="hidden md:flex flex-col items-end">
          <span className="text-sm font-medium text-white">
            {adminProfile.fullName}
          </span>
          <span className="text-xs text-gray-500">{adminProfile.email}</span>
        </div>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center gap-2 group outline-none"
        >
          <div className="relative h-10 w-10 rounded-full ring-2 ring-pink-500/50 overflow-hidden flex-shrink-0 transition-all group-hover:ring-pink-500">
            {adminProfile.avatar ? (
              <Image
                src={adminProfile.avatar}
                alt="Admin Avatar"
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-pink-500 to-purple-600 text-white font-bold uppercase">
                {adminProfile.fullName[0]}
              </div>
            )}
          </div>

          <ChevronDown
            className={`h-4 w-4 text-gray-400 transition-all duration-300 group-hover:text-white ${isMenuOpen ? "rotate-180 text-white" : ""}`}
          />
        </button>

        {isMenuOpen && (
          <div className="absolute top-full right-0 mt-3 w-56 bg-[#09090b] border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] py-2 z-50 origin-top-right animate-in fade-in zoom-in-95 duration-200">
            <div className="px-4 py-2 border-b border-white/5 mb-2 md:hidden">
              <p className="text-sm font-medium text-white truncate">
                {adminProfile.fullName}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {adminProfile.email}
              </p>
            </div>

            <button className="w-full px-4 py-2.5 text-left flex items-center gap-3 text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
              <Settings className="h-4 w-4" />
              <span className="text-sm font-medium">Cài đặt tài khoản</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full px-4 py-2.5 text-left flex items-center gap-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors mt-1"
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
