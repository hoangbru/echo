import {
  LayoutDashboard,
  Music,
  Users,
  CheckCircle,
  FileUp,
  BarChart3,
  Library,
  LucideIcon,
} from "lucide-react";

export type SidebarItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
};

export const adminMenuItems: SidebarItem[] = [
  { label: "Tổng quan", href: "/admin", icon: LayoutDashboard },
  { label: "Quản lý bài hát", href: "/admin/content/tracks", icon: Music },
  { label: "Quản lý nghệ sĩ", href: "/admin/content/artists", icon: Users },
  { label: "Quản lý Album", href: "/admin/content/albums", icon: Music },
  {
    label: "Yêu cầu nghệ sĩ",
    href: "/admin/artist-requests",
    icon: CheckCircle,
    badge: 3,
  },
  { label: "Tải lên hệ thống", href: "/admin/upload", icon: FileUp },
  { label: "Thống kê", href: "/admin/analytics", icon: BarChart3 },
];

export const artistMenuItems: SidebarItem[] = [
  { label: "Tổng quan", href: "/studio/dashboard", icon: LayoutDashboard },
  { label: "Sản phẩm âm nhạc", href: "/studio/albums", icon: Library },
  { label: "Phân tích số liệu", href: "/studio/analytics", icon: BarChart3 },
];
