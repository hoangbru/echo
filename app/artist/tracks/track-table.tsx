"use client";

import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { TrackItem } from "./track-item";
import TrackToolbar from "./track-toolbar";
import DataPagination from "@/components/data-pagination";

import { ITEMS_PER_PAGE } from "@/constants/pagination";
import { createClient } from "@/lib/supabase/client";
import { removeVietnameseTones } from "@/lib/utils/string";

interface TrackTableProps {}

export default function TrackTable({}: TrackTableProps) {
  const router = useRouter();
  const supabase = createClient();
  const [tracks, setTracks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchTracks = async () => {
    setIsLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data: artist } = await supabase
        .from("artist")
        .select("id")
        .eq("user_id", user?.id)
        .single();

      if (artist) {
        let query = supabase
          .from("track")
          .select("*, genre(name)", { count: "exact" })
          .eq("artist_id", artist.id)
          .order("created_at", { ascending: false });

        if (search) {
          const cleanSearch = removeVietnameseTones(search);
          query = query.ilike("title_search", `%${cleanSearch}%`);
        }

        if (statusFilter === "public") query = query.eq("is_published", true);
        if (statusFilter === "private") query = query.eq("is_published", false);

        const from = (currentPage - 1) * ITEMS_PER_PAGE;
        const to = from + ITEMS_PER_PAGE - 1;
        query = query.range(from, to);

        const { data, count } = await query;
        const tracksResponse = data?.map((t: any) => ({
          albumId: t.album_id,
          artistId: t.artist_id,
          audioUrl: t.audio_url,
          createdAt: t.created_at,
          duration: t.duration,
          genreId: t.genre_id,
          genre: t.genre && t.genre.name,
          id: t.id,
          imageUrl: t.image_url,
          isExplicit: t.is_explicit,
          isPublished: t.is_published,
          isrc: t.isrc,
          lyrics: t.lyrics,
          previewUrl: t.preview_url,
          rating: t.rating,
          releaseDate: t.release_date,
          title: t.title,
          totalDownloads: t.total_downloads,
          totalStreams: t.total_streams,
          updatedAt: t.updated_at,
        }));

        setTracks(tracksResponse || []);
        setTotalCount(count || 0);
      }
    } catch (error) {
      console.error("Đã có lỗi xảy ra, vui lòng thử lại sau!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTracks();
    }, 500);
    return () => clearTimeout(timer);
  }, [search, statusFilter, currentPage]);

  const handleDelete = async (track: any) => {
    try {
      // 1. Trích xuất path từ URL (Ví dụ: từ public URL lấy ra 'artist_id/file_name')
      // URL có dạng: .../storage/v1/object/public/tracks/artist_1/audio_123.mp3
      const getFilePath = (url: string, bucket: string) => {
        const parts = url.split(`${bucket}/`);
        return parts.length > 1 ? parts[1] : null;
      };

      const audioPath = getFilePath(track.audioUrl, "tracks");
      const coverPath = track.imageUrl
        ? getFilePath(track.imageUrl, "covers")
        : null;

      // 2. Xóa file trên Storage
      if (audioPath) {
        await supabase.storage.from("tracks").remove([audioPath]);
      }
      if (coverPath) {
        await supabase.storage.from("covers").remove([coverPath]);
      }

      const { error } = await supabase
        .from("track")
        .delete()
        .eq("id", track.id);

      if (error) throw error;

      setTracks((prev) => prev.filter((t) => t.id !== track.id));
      setTotalCount((prev) => prev - 1);
    } catch (error: any) {
      console.error("Đã có lỗi xảy ra, vui lòng thử lại sau!");
    }
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <Fragment>
      {/* THANH CÔNG CỤ: TÌM KIẾM & LỌC */}
      <TrackToolbar
        search={search}
        setCurrentPage={setCurrentPage}
        setSearch={setSearch}
        setStatusFilter={setStatusFilter}
        statusFilter={statusFilter}
      />

      <div className="bg-[#18181b] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 text-gray-400 text-xs font-bold uppercase tracking-wider">
              <th className="py-4 px-4">Bài hát</th>
              <th className="py-4 px-4">Thể loại</th>
              <th className="py-4 px-4">Ngày phát hành</th>
              <th className="py-4 px-4">Trạng thái</th>
              <th className="py-4 px-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-20 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-pink-500 mx-auto" />
                </td>
              </tr>
            ) : tracks.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-20 text-center text-gray-500">
                  Không tìm thấy bài hát nào.
                </td>
              </tr>
            ) : (
              tracks.map((track) => (
                <TrackItem
                  key={track.id}
                  track={track}
                  onEdit={(t) => router.push(`/artist/tracks/edit/${t.id}`)}
                  onDelete={handleDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PHÂN TRANG */}
      <DataPagination
        currentPage={currentPage}
        totalPages={totalPages}
        currentCount={tracks.length}
        totalCount={totalCount}
        itemName="bài hát"
        onPageChange={setCurrentPage}
      />
    </Fragment>
  );
}
