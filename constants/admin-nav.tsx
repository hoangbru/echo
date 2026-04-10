import {
  LayoutDashboard,
  Music,
  Users,
  FileUp,
  BarChart3,
  CheckCircle,
} from "lucide-react";

export const adminNavItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    label: "Tracks",
    href: "/admin/content/tracks",
    icon: <Music className="h-4 w-4" />,
  },
  {
    label: "Artists",
    href: "/admin/content/artists",
    icon: <Users className="h-4 w-4" />,
  },
  {
    label: "Albums",
    href: "/admin/content/albums",
    icon: <Music className="h-4 w-4" />,
  },
  {
    label: "Artist Requests",
    href: "/admin/artist-requests",
    icon: <CheckCircle className="h-4 w-4" />,
    badge: 3,
  },
  {
    label: "Upload",
    href: "/admin/upload",
    icon: <FileUp className="h-4 w-4" />,
  },
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: <BarChart3 className="h-4 w-4" />,
  },
];
