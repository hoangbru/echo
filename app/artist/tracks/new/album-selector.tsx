import Image from "next/image";
import {
  Globe,
  Lock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRef } from "react";

interface Album {
  id: string;
  title: string;
  coverImage: string;
  isPublished: boolean;
}

interface AlbumSelectorProps {
  albums: Album[];
  selectedAlbumId: string;
  onSelect: (id: string) => void;
}

export function AlbumSelector({
  albums,
  selectedAlbumId,
  onSelect,
}: AlbumSelectorProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Hàm xử lý cuộn khi bấm nút
  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 250; // Khoảng cách trượt mỗi lần bấm (tương đương ~1.5 cái card)
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!albums || albums.length === 0) {
    return (
      <p className="text-sm text-gray-500 italic">Bạn chưa có Album nào.</p>
    );
  }

  return (
    <div className="w-full">
      <label className="block text-xs font-bold text-gray-400 uppercase mb-3">
        Chọn Album (Nếu có)
      </label>

      {/* Thêm class group để bắt sự kiện hover cho 2 nút bấm */}
      <div className="relative group">
        {/* Nút trượt sang TRÁI (Bình thường ẩn, di chuột vào khu vực album mới hiện) */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault(); // Tránh submit form nếu nằm trong thẻ <form>
            scroll("left");
          }}
          className="absolute left-0 top-1/2 -translate-y-[60%] -ml-4 z-10 bg-[#18181b]/90 backdrop-blur text-white p-2 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-pink-500 hover:border-pink-500 hover:scale-110 shadow-xl"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* CONTAINER CHỨA ALBUM */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar"
        >
          {/* Nút Huỷ chọn (Single) */}
          <div
            onClick={() => onSelect("")}
            className={`shrink-0 w-32 p-3 rounded-xl border-2 cursor-pointer transition-all snap-start flex flex-col items-center justify-center text-center ${
              selectedAlbumId === ""
                ? "border-pink-500 bg-pink-500/10"
                : "border-white/10 bg-[#09090b] hover:border-white/30"
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-2">
              <span className="text-gray-400 text-xs">Single</span>
            </div>
            <p className="text-xs font-medium text-white">Phát hành đơn</p>
          </div>

          {/* Danh sách Album */}
          {albums.map((album) => {
            const isSelected = selectedAlbumId === album.id;
            return (
              <div
                key={album.id}
                onClick={() => onSelect(album.id)}
                className={`relative shrink-0 w-36 p-2 rounded-xl border-2 cursor-pointer transition-all snap-start bg-[#09090b] ${
                  isSelected
                    ? "border-pink-500 bg-pink-500/5"
                    : "border-white/10 hover:border-white/30"
                }`}
              >
                <div className="relative aspect-square w-full rounded-lg overflow-hidden mb-2">
                  <Image
                    src={album.coverImage || "/default-cover.jpg"}
                    alt={album.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-1 right-1 bg-black/60 rounded-full p-1 backdrop-blur-sm">
                    {album.isPublished ? (
                      <Globe className="w-3 h-3 text-green-400" />
                    ) : (
                      <Lock className="w-3 h-3 text-yellow-400" />
                    )}
                  </div>
                </div>
                <p
                  className="text-xs font-bold text-white truncate px-1"
                  title={album.title}
                >
                  {album.title}
                </p>

                {/* Dấu tích xanh khi được chọn */}
                {isSelected && (
                  <div className="absolute -top-2 -right-2 bg-[#18181b] rounded-full shadow-lg">
                    <CheckCircle2 className="w-6 h-6 text-pink-500 fill-pink-500/20" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Nút trượt sang PHẢI */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            scroll("right");
          }}
          className="absolute right-0 top-1/2 -translate-y-[60%] -mr-4 z-10 bg-[#18181b]/90 backdrop-blur text-white p-2 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-pink-500 hover:border-pink-500 hover:scale-110 shadow-xl"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
