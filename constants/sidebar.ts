import {
  LayoutDashboard,
  Music,
  Users,
  CheckCircle,
  FileUp,
  BarChart3,
  Library,
  LucideIcon,
  UserCog,
  Disc,
  ListMusic,
  Flag,
  ShieldAlert,
} from "lucide-react";

export type SidebarItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
};

export const adminMenuItems = [
  { label: "Tổng quan", href: "/admin", icon: LayoutDashboard },
  { label: "Thống kê hệ thống", href: "/admin/analytics", icon: BarChart3 },

  { label: "Người dùng (Listeners)", href: "/admin/users", icon: Users },
  { label: "Hồ sơ Nghệ sĩ", href: "/admin/artists", icon: UserCog },
  {
    label: "Yêu cầu duyệt",
    href: "/admin/artist-requests",
    icon: CheckCircle,
    badge: 3,
  },

  { label: "Thể loại nhạc (Genres)", href: "/admin/genres", icon: ListMusic },

  { label: "Báo cáo vi phạm", href: "/admin/reports", icon: Flag, badge: 5 },
  { label: "Nhật ký hệ thống", href: "/admin/audit-logs", icon: ShieldAlert },
];

export const artistMenuItems: SidebarItem[] = [
  { label: "Tổng quan", href: "/studio/dashboard", icon: LayoutDashboard },
  { label: "Sản phẩm âm nhạc", href: "/studio/albums", icon: Library },
  { label: "Phân tích số liệu", href: "/studio/analytics", icon: BarChart3 },
];
