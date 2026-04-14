"use client";

import {
  LayoutDashboard,
  Music,
  Upload,
  Mic2,
  BarChart3,
  Settings,
  Library,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { icon: LayoutDashboard, label: "Tổng quan", href: "/artist/dashboard" },
  { icon: Music, label: "Bài hát của tôi", href: "/artist/tracks" },
  { icon: Upload, label: "Tải nhạc lên", href: "/artist/upload" },
  { icon: Library, label: "Album / EP", href: "/artist/albums" },
  { icon: BarChart3, label: "Thống kê", href: "/artist/analytics" },
];

export function ArtistSidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#18181b] border-r border-white/10 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
    >
      <div className="flex flex-col h-full p-6">
        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
            <Mic2 className="text-white w-5 h-5" />
          </div>
          <span className="font-black text-xl text-white tracking-tighter uppercase">
            Echo Artist
          </span>
        </div>

        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive
                    ? "bg-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.3)]"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5">
          <Link
            href="/settings"
            className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors"
          >
            <Settings className="w-5 h-5" />
            Cài đặt tài khoản
          </Link>
        </div>
      </div>
    </aside>
  );
}
