import Image from "next/image";

import { AlbumDetail } from "@/types";
import { formatDate } from "@/lib/utils/format";

interface AlbumHeroSectionProps {
  album: AlbumDetail;
  totalMins: number;
}

export const AlbumHeroSection = ({
  album,
  totalMins,
}: AlbumHeroSectionProps) => {
  return (
    <div className="relative w-full h-[30vh] md:h-[40vh] min-h-[340px] bg-gradient-to-b from-neutral-600 to-[#121212] px-6 pt-20 pb-6 flex items-end">
      <div className="flex flex-col md:flex-row md:items-end gap-6 z-10 w-full">
        <div className="relative w-48 h-48 md:w-60 md:h-60 shadow-[0_4px_60px_rgba(0,0,0,0.5)] shrink-0 group">
          <Image
            src={album.coverImage || "/default-cover.jpg"}
            alt={album.title}
            fill
            className="object-cover rounded-sm"
          />
        </div>
        <div className="flex flex-col gap-2 text-white">
          <span className="text-xs md:text-sm font-bold uppercase drop-shadow-md">
            {album.albumType || "Album"}
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter pb-2 drop-shadow-lg truncate">
            {album.title}
          </h1>
          <div className="flex items-center gap-2 text-sm font-medium mt-2 flex-wrap">
            {album.artist.profileImage ? (
              <div className="relative rounded-full w-6 h-6">
                <Image
                  src={album.artist.profileImage || "/default-avatar.png"}
                  width={24}
                  height={24}
                  alt="artist"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-primary/60 text-foreground font-bold uppercase text-sm">
                {(album.artist.stageName || "U")[0]}
              </div>
            )}
            <span className="hover:underline cursor-pointer font-bold">
              {album.artist.stageName}
            </span>
            <span className="text-gray-300">
              • {formatDate(album.releaseDate, "yearOnly")}
            </span>
            <span className="text-gray-300">
              • {album.totalTracks} bài hát,
            </span>
            <span className="text-gray-400 font-normal">
              khoảng {totalMins} phút
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
