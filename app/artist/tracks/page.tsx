"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Search,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrackItem } from "./track-item";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ITEMS_PER_PAGE = 8;

export default function ArtistTracksPage() {
  const router = useRouter();
  const supabase = createClient();
  const [tracks, setTracks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // States cho Filter & Pagination
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchTracks = async () => {
    setIsLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Tìm artistId
    const { data: artist } = await supabase
      .from("ArtistProfile")
      .select("id")
      .eq("userId", user?.id)
      .single();

    if (artist) {
      let query = supabase
        .from("Track")
        .select("*, Genre(name)", { count: "exact" })
        .eq("artistId", artist.id)
        .order("createdAt", { ascending: false });

      // Lọc theo tên
      if (search) query = query.ilike("title", `%${search}%`);

      // Lọc theo trạng thái
      if (statusFilter === "public") query = query.eq("isPublished", true);
      if (statusFilter === "private") query = query.eq("isPublished", false);

      // Phân trang
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      query = query.range(from, to);

      const { data, count, error } = await query;
      if (!error) {
        setTracks(data || []);
        setTotalCount(count || 0);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTracks();
    }, 500); // Debounce search
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

      // 3. Xóa bản ghi trong Database
      const { error } = await supabase
        .from("Track")
        .delete()
        .eq("id", track.id);

      if (error) throw error;

      // 4. Cập nhật lại giao diện (Không cần reload trang)
      setTracks((prev) => prev.filter((t) => t.id !== track.id));
      setTotalCount((prev) => prev - 1);
    } catch (error: any) {
      console.error("Lỗi khi xóa:", error);
      alert("Không thể xóa bài hát: " + error.message);
    }
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Bài hát của tôi
          </h1>
          <p className="text-gray-400 mt-1">
            Quản lý kho nhạc và trạng thái phát hành.
          </p>
        </div>
        <Link href="/artist/upload">
          <Button className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-6 shadow-[0_0_20px_rgba(236,72,153,0.3)]">
            <Plus className="w-4 h-4 mr-2" /> Tải nhạc mới
          </Button>
        </Link>
      </div>

      {/* THANH CÔNG CỤ: TÌM KIẾM & LỌC */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-[#18181b] p-4 rounded-2xl border border-white/10">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Tìm tên bài hát..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#09090b] border border-white/5 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:border-pink-500 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-gray-500 ml-2" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#09090b] border border-white/5 rounded-xl px-4 py-2 text-sm text-white focus:border-pink-500 outline-none"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="public">Công khai (Public)</option>
            <option value="private">Riêng tư (Private)</option>
          </select>
        </div>
      </div>

      {/* BẢNG DANH SÁCH */}
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
                  onEdit={(t) => router.push(`/artist/edit/${t.id}`)}
                  onDelete={handleDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PHÂN TRANG */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-gray-500">
            Hiển thị{" "}
            <span className="text-white font-medium">{tracks.length}</span> trên{" "}
            <span className="text-white font-medium">{totalCount}</span> bài hát
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="border-white/10 text-gray-400 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Trước
            </Button>
            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="border-white/10 text-gray-400 hover:text-white"
            >
              Sau <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
