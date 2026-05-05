import {
  MoreHorizontal,
  Play,
  Plus,
  Heart,
  ListPlus,
  User,
  Disc,
  Share,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DropdownTrackMenu = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button
        onClick={(e) => e.stopPropagation()}
        className="text-gray-500 hover:text-white p-2 opacity-0 group-hover:opacity-100 transition focus:outline-none"
      >
        <MoreHorizontal className="w-5 h-5" />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align="end"
      className="w-56 bg-[#282828] border-none text-gray-300 shadow-2xl p-1 rounded-md z-[110]"
    >
      <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/10 cursor-pointer p-3 text-sm font-medium">
        <Plus className="w-4 h-4 mr-1" /> Thêm vào playlist
      </DropdownMenuItem>
      <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/10 cursor-pointer p-3 text-sm font-medium">
        <Heart className="w-4 h-4 mr-1" /> Lưu vào bài hát yêu thích
      </DropdownMenuItem>
      <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/10 cursor-pointer p-3 text-sm font-medium">
        <ListPlus className="w-4 h-4 mr-1" /> Thêm vào danh sách chờ
      </DropdownMenuItem>
      <DropdownMenuSeparator className="bg-white/10" />
      <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/10 cursor-pointer p-3 text-sm font-medium">
        <User className="w-4 h-4 mr-1" /> Đi tới nghệ sĩ
      </DropdownMenuItem>
      <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/10 cursor-pointer p-3 text-sm font-medium">
        <Disc className="w-4 h-4 mr-1" /> Đi tới album
      </DropdownMenuItem>
      <DropdownMenuSeparator className="bg-white/10" />
      <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/10 cursor-pointer p-3 text-sm font-medium">
        <Share className="w-4 h-4 mr-1" /> Chia sẻ
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

export default DropdownTrackMenu;
