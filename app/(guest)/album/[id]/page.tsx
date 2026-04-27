import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { keysToCamel } from "@/lib/utils/format";
import { AlbumTrackList } from "@/components/guest/album/album-track-list";
import { AlbumCard } from "@/components/album-card";

export default async function AlbumDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createClient();

  // 1. Fetch data Album hiện tại
  const { data: albumData, error } = await supabase
    .from("album")
    .select(
      `
      *,
      artist (id, stage_name, profile_image),
      track (*)
    `,
    )
    .eq("id", id)
    .eq("is_published", true)
    .single();

  if (error || !albumData) return notFound();
  const album = keysToCamel(albumData);

  // 2. Fetch các Album khác CỦA CÙNG NGHỆ SĨ (Ngoại trừ album đang xem)
  const { data: otherAlbumsData } = await supabase
    .from("album")
    .select(
      `id, title, cover_image, release_date, album_type, artist(id, stage_name)`,
    )
    .eq("artist_id", album.artistId)
    .neq("id", id) // 👈 Loại trừ cái đang xem ra
    .eq("is_published", true)
    .order("release_date", { ascending: false })
    .limit(6);

  const otherAlbums = otherAlbumsData ? keysToCamel(otherAlbumsData) : [];

  // Logic Sắp xếp & Tính giờ (Giữ nguyên)
  const sortedTracks =
    album.track?.sort((a: any, b: any) => {
      if (a.discNumber === b.discNumber) return a.trackNumber - b.trackNumber;
      return a.discNumber - b.discNumber;
    }) || [];

  const totalDurationSeconds = sortedTracks.reduce(
    (acc: number, t: any) => acc + (t.duration || 0),
    0,
  );
  const totalMins = Math.floor(totalDurationSeconds / 60);

  // Xử lý Ngày tháng cho Credit
  const releaseDateObj = new Date(album.releaseDate);
  const releaseYear = releaseDateObj.getFullYear();
  const formattedFullDate = releaseDateObj.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#121212] pb-32">
      {/* --- HERO SECTION --- */}
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
              <Image
                src={album.artist?.profileImage || "/default-avatar.png"}
                width={24}
                height={24}
                alt="artist"
                className="rounded-full object-cover w-6 h-6"
              />
              <span className="hover:underline cursor-pointer font-bold">
                {album.artist?.stageName}
              </span>
              <span className="text-gray-300">• {releaseYear}</span>
              <span className="text-gray-300">
                • {sortedTracks.length} bài hát,
              </span>
              <span className="text-gray-400 font-normal">
                khoảng {totalMins} phút
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="px-6 bg-gradient-to-b from-neutral-900/50 to-[#121212] min-h-screen pt-4">
        {/* Danh sách bài hát */}
        <AlbumTrackList album={album} tracks={sortedTracks} />

        {/* 👇 1. CREDIT BẢN QUYỀN (Spotify Style) */}
        <div className="mt-8 mb-12 flex flex-col gap-1 text-[13px] text-gray-400 font-medium">
          <p>{formattedFullDate}</p>
          {/* © là Copyright (Bản quyền bài hát/lời/nhạc), ℗ là Phonogram (Bản quyền bản ghi âm) */}
          <p>
            © {releaseYear} {album.artist?.stageName}
            {album.recordLabel ? `, exclusively licensed to ${album.recordLabel}` : ''}
          </p>
          <p>
            ℗ {releaseYear} {album.artist?.stageName}
            {album.recordLabel ? `, exclusively licensed to ${album.recordLabel}` : ''}
          </p>
        </div>

        {/* 👇 2. CÁC ALBUM KHÁC CỦA NGHỆ SĨ */}
        {otherAlbums.length > 0 && (
          <div className="mt-12 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white hover:underline cursor-pointer">
                More by {album.artist?.stageName}
              </h2>
              <Link
                href={`/artist/${album.artist?.id}`}
                className="text-sm font-bold text-gray-400 hover:text-white uppercase tracking-wider"
              >
                See discography
              </Link>
            </div>

            {/* Dùng lại Component AlbumCard dạng Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {otherAlbums.map((otherAlbum: any) => (
                <AlbumCard key={otherAlbum.id} album={otherAlbum} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
