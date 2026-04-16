"use client";

import {
  Menu,
  LogOut,
  ChevronDown,
  Settings,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Artist } from "@/types/artist.type";

interface ArtistHeaderProps {
  onOpenSidebar: () => void;
  profile: Artist
}

export function ArtistHeader({ onOpenSidebar, profile }: ArtistHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();

  // Đóng menu khi click ra ngoài
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

  return (
    <header className="bg-[#18181b] border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
      {/* Nút mở menu trên Mobile */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden text-gray-400 hover:text-white transition"
          aria-label="Open sidebar"
        >
          <Menu className="h-6 w-6" />
        </button>
        {/* Tiêu đề có thể thay đổi tùy trang nếu muốn, ở đây để chung */}
        <h1 className="text-xl font-bold text-white hidden sm:block">
          Khu Vực Sáng Tạo
        </h1>
      </div>

      {/* Khu vực Profile Artist góc phải */}
      <div className="relative flex items-center gap-4" ref={menuRef}>
        {/* Nút View Public Profile (Xem trang cá nhân với tư cách khán giả) */}
        <Link
          href="/profile"
          className="hidden md:flex items-center gap-2 text-sm text-gray-400 hover:text-pink-400 transition-colors mr-2"
          title="Xem hồ sơ công khai"
        >
          <ExternalLink className="h-4 w-4" />
          Hồ sơ công khai
        </Link>

        {/* Thông tin tóm tắt */}
        <div className="hidden md:flex flex-col items-end">
          <span className="text-sm font-bold text-white flex items-center gap-1">
            {profile.stageName}
            {/* Dấu tích xanh nhỏ bên cạnh tên */}
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 text-pink-500"
            >
              <path
                fillRule="evenodd"
                d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          <span className="text-xs text-pink-400/80">Verified Artist</span>
        </div>

        {/* Nút bấm mở Dropdown */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center gap-2 group outline-none"
        >
          <div className="relative h-10 w-10 rounded-full ring-2 ring-pink-500/50 overflow-hidden flex-shrink-0 transition-all group-hover:ring-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.2)]">
            {profile.profileImage ? (
              <Image
                src={profile.profileImage}
                alt={profile.stageName || "Artist Avatar"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-pink-500 to-purple-600 text-white font-bold uppercase">
                {profile.stageName ? profile.stageName.charAt(0) : "A"}
              </div>
            )}
          </div>
          <ChevronDown
            className={`h-4 w-4 text-gray-400 transition-all duration-300 group-hover:text-white ${isMenuOpen ? "rotate-180 text-white" : ""}`}
          />
        </button>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute top-full right-0 mt-3 w-56 bg-[#09090b] border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] py-2 z-50 origin-top-right animate-in fade-in zoom-in-95 duration-200">
            <div className="px-4 py-3 border-b border-white/5 mb-2 md:hidden">
              <p className="text-sm font-bold text-white truncate flex items-center gap-1">
                {profile.stageName}
              </p>
              <p className="text-xs text-pink-400">Verified Artist</p>
            </div>

            <Link
              href="/profile"
              onClick={() => setIsMenuOpen(false)}
              className="w-full px-4 py-2.5 text-left flex items-center gap-3 text-gray-300 hover:bg-white/5 hover:text-pink-400 transition-colors md:hidden"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="text-sm font-medium">Hồ sơ công khai</span>
            </Link>

            <Link
              href="/settings"
              onClick={() => setIsMenuOpen(false)}
              className="w-full px-4 py-2.5 text-left flex items-center gap-3 text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
            >
              <Settings className="h-4 w-4" />
              <span className="text-sm font-medium">Cài đặt Artist</span>
            </Link>

            <button
              onClick={handleSignOut}
              className="w-full px-4 py-2.5 text-left flex items-center gap-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors mt-1 border-t border-white/5"
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
