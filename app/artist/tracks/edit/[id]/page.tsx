"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useParams } from "next/navigation";
import {
  UploadCloud,
  Loader2,
  Music,
  ChevronLeft,
  AlertCircle,
  CheckCircle2,
  Info,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { formatDuration } from "@/lib/format";

export default function EditTrackPage() {
  const router = useRouter();
  const params = useParams();
  const trackId = params.id;
  const supabase = createClient();

  // States Dữ liệu
  const [originalFileName, setOriginalFileName] = useState("");
  const [duration, setDuration] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [isrc, setIsrc] = useState("");
  const [albumId, setAlbumId] = useState("");
  const [genreId, setGenreId] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [isExplicit, setIsExplicit] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [releaseDate, setReleaseDate] = useState("");
  const [oldCoverUrl, setOldCoverUrl] = useState("");

  // States File & Danh sách
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [genres, setGenres] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);

  // States Hệ thống
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const coverInputRef = useRef<HTMLInputElement>(null!);

  const getFileNameFromUrl = (url: string) => {
    if (!url) return "Unknown Audio File";
    try {
      // 1. Lấy phần cuối cùng của URL (ví dụ: audio_123456_my_song.mp3)
      const urlParts = url.split("/");
      const lastPart = urlParts[urlParts.length - 1];

      // 2. Decode các ký tự %20 thành dấu cách
      const decodedName = decodeURIComponent(lastPart);

      // 3. (Tùy chọn) Cắt bỏ chữ "audio_timestamp_" ở đầu để tên hiển thị sạch sẽ hơn
      const match = decodedName.match(/^audio_\d+_(.+)$/);
      if (match && match[1]) {
        return match[1];
      }
      return decodedName;
    } catch (e) {
      return "Audio File";
    }
  };

  // 1. Fetch dữ liệu Bài hát, Thể loại, Album
  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("Chưa đăng nhập");

        const { data: artistProfile } = await supabase
          .from("ArtistProfile")
          .select("id")
          .eq("userId", user.id)
          .single();
        if (!artistProfile) throw new Error("Không tìm thấy Artist Profile");

        // Fetch Thể loại & Album
        const [{ data: genreData }, { data: albumData }] = await Promise.all([
          supabase.from("Genre").select("id, name"),
          supabase
            .from("Album")
            .select("id, title, coverImage, isPublished, releaseDate")
            .eq("artistId", artistProfile.id),
        ]);

        if (genreData) setGenres(genreData);
        if (albumData) setAlbums(albumData);

        // Fetch Track
        const { data: track, error } = await supabase
          .from("Track")
          .select("*")
          .eq("id", trackId)
          .single();
        if (error || !track) throw new Error("Không tìm thấy bài hát");

        setTitle(track.title);
        setOriginalFileName(getFileNameFromUrl(track.audioUrl));
        setDuration(track.duration || null);
        setIsrc(track.isrc || "");
        setAlbumId(track.albumId || "");
        setGenreId(track.genreId || "");
        setLyrics(track.lyrics || "");
        setIsExplicit(track.isExplicit);
        setIsPublished(track.isPublished);
        setOldCoverUrl(track.imageUrl);
        setCoverPreview(track.imageUrl);
        if (track.releaseDate) {
          setReleaseDate(
            new Date(track.releaseDate).toISOString().split("T")[0],
          );
        }
      } catch (err: any) {
        setNotification({
          type: "error",
          message: "Lỗi tải dữ liệu: " + err.message,
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [trackId, supabase]);

  // Tìm thông tin Album đang chọn
  const selectedAlbum = albums.find((a) => a.id === albumId);

  // 2. Tự động đồng bộ trạng thái nếu thuộc Album
  useEffect(() => {
    if (selectedAlbum) {
      setIsPublished(selectedAlbum.isPublished);
      if (selectedAlbum.releaseDate) {
        setReleaseDate(
          new Date(selectedAlbum.releaseDate).toISOString().split("T")[0],
        );
      }
    }
  }, [albumId, selectedAlbum]);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleClearCover = () => {
    setCoverFile(null);
    // Nếu có album thì fallback về ảnh album, nếu không thì rỗng
    setCoverPreview(selectedAlbum ? selectedAlbum.coverImage : null);
    if (coverInputRef.current) coverInputRef.current.value = "";
  };

  // Helper xóa file
  const getPathFromUrl = (url: string) => {
    const parts = url.split("covers/");
    return parts.length > 1 ? parts[1] : null;
  };

  // 3. Xử lý Update
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setNotification(null);

    let newCoverUrl = oldCoverUrl;
    let newCoverPath: string | null = null;

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data: artistProfile } = await supabase
        .from("ArtistProfile")
        .select("id")
        .eq("userId", user?.id!)
        .single();

      // A. Nếu có chọn ảnh TÙY CHỈNH MỚI
      if (coverFile) {
        const safeName = coverFile.name.replace(/[^a-zA-Z0-9.\-_]/g, "");
        newCoverPath = `tracks/artist_${artistProfile?.id}/cover_${Date.now()}_${safeName}`;

        const { error: uploadErr } = await supabase.storage
          .from("covers")
          .upload(newCoverPath, coverFile);
        if (uploadErr)
          throw new Error("Không thể tải ảnh mới lên kho lưu trữ.");
        newCoverUrl = supabase.storage.from("covers").getPublicUrl(newCoverPath)
          .data.publicUrl;
      }
      // B. Nếu người dùng bấm [X] xóa ảnh custom và muốn dùng ảnh của Album
      else if (!coverPreview && selectedAlbum) {
        newCoverUrl = selectedAlbum.coverImage;
      }

      // Cập nhật DB
      const { error: dbErr } = await supabase
        .from("Track")
        .update({
          title,
          albumId: albumId || null,
          genreId: genreId || null,
          lyrics: lyrics || null,
          isExplicit,
          isPublished,
          releaseDate: new Date(releaseDate).toISOString(),
          imageUrl: newCoverUrl,
        })
        .eq("id", trackId);

      if (dbErr) throw new Error("Không thể cập nhật thông tin bài hát.");

      // Dọn dẹp ảnh cũ (CHỈ XÓA NẾU ẢNH CŨ LÀ ẢNH CỦA TRACK NÀY, KHÔNG ĐƯỢC XÓA ẢNH CỦA ALBUM)
      if ((coverFile || (!coverPreview && selectedAlbum)) && oldCoverUrl) {
        const oldPath = getPathFromUrl(oldCoverUrl);
        // Phải đảm bảo path chứa 'tracks/' thì mới xóa (tránh xóa nhầm path 'albums/')
        if (oldPath && oldPath.includes("tracks/")) {
          await supabase.storage.from("covers").remove([oldPath]);
        }
      }

      setNotification({
        type: "success",
        message: "Cập nhật bài hát thành công! Đang chuyển hướng...",
      });
      setTimeout(() => router.push("/artist/tracks"), 1500);
    } catch (err: any) {
      if (newCoverPath)
        await supabase.storage.from("covers").remove([newCoverPath]);
      setNotification({
        type: "error",
        message: err.message || "Đã xảy ra lỗi ngoài ý muốn.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading)
    return (
      <div className="py-24 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-pink-500 mx-auto" />
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6 text-gray-400 hover:text-white pl-0"
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Quay lại
      </Button>

      <h1 className="text-3xl font-black text-white mb-8 flex items-center gap-3">
        <Music className="w-8 h-8 text-pink-500" />
        <span className="truncate max-w-[600px]">
          Chỉnh sửa: {title || "Không có tiêu đề"}
        </span>
      </h1>

      {notification && (
        <div
          className={`mb-6 p-4 rounded-xl border flex items-center gap-3 animate-in fade-in ${notification.type === "success" ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <p className="font-medium">{notification.message}</p>
        </div>
      )}

      <form
        onSubmit={handleUpdate}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* CỘT TRÁI: ẢNH BÌA */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#18181b] p-6 rounded-2xl border border-white/10">
            <label className="text-sm font-bold text-gray-300 block mb-4">
              Ảnh bìa (Artwork)
            </label>
            <div
              onClick={() => coverInputRef.current?.click()}
              className="relative aspect-square rounded-xl border-2 border-dashed border-white/10 overflow-hidden cursor-pointer hover:border-pink-500/50 transition-all flex flex-col items-center justify-center bg-[#09090b] group"
            >
              {coverPreview || selectedAlbum ? (
                <>
                  <Image
                    src={coverPreview || selectedAlbum!.coverImage}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />

                  {/* Nút xóa ảnh custom */}
                  {coverPreview &&
                    oldCoverUrl !== selectedAlbum?.coverImage && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClearCover();
                        }}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full z-10 hover:scale-110 shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}

                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                    <UploadCloud className="w-8 h-8 text-white mb-2" />
                    <span className="text-xs text-white">Đổi ảnh riêng</span>
                  </div>
                </>
              ) : (
                <>
                  <UploadCloud className="w-10 h-10 text-gray-500 mb-2 group-hover:text-pink-500 transition-colors" />
                  <span className="text-xs text-gray-400">
                    Tải ảnh lên (Vuông)
                  </span>
                </>
              )}
            </div>
            <input
              type="file"
              ref={coverInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleCoverChange}
            />

            {/* Ghi chú thông minh */}
            {selectedAlbum && !coverPreview && (
              <p className="text-xs text-pink-500 mt-3 text-center">
                * Đang sử dụng ảnh bìa của Album
              </p>
            )}
          </div>

          <div className="bg-[#18181b] p-6 rounded-2xl border border-white/10">
            <label className="text-sm font-bold text-gray-300 block mb-4">
              File âm thanh (Bản gốc)
            </label>
            <div className="flex items-center gap-3 bg-[#09090b] p-3 rounded-xl border border-white/5 opacity-60">
              <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center shrink-0">
                <Music className="w-5 h-5 text-pink-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className="text-sm font-medium text-white truncate"
                  title={originalFileName}
                >
                  {originalFileName}.mp3
                </p>
                <p className="text-xs text-gray-500">
                  Thời lượng: {formatDuration(duration)}
                </p>
              </div>
            </div>
            <p className="text-[10px] text-gray-500 mt-3 text-center italic text-balance">
              * Không thể thay đổi file âm thanh. Vui lòng xóa bài hát và tải
              lên lại nếu có bản thu âm mới.
            </p>
          </div>
        </div>

        {/* CỘT PHẢI: METADATA */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#18181b] p-8 rounded-2xl border border-white/10 space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                Tiêu đề bài hát *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-white focus:border-pink-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                  Thể loại
                </label>
                <select
                  value={genreId}
                  onChange={(e) => setGenreId(e.target.value)}
                  className="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-white outline-none"
                >
                  <option value="">Chọn thể loại</option>
                  {genres.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                  Album
                </label>
                <select
                  value={albumId}
                  onChange={(e) => {
                    setAlbumId(e.target.value);
                    if (e.target.value) handleClearCover(); // Tự động xóa ảnh custom nếu đổi sang album khác
                  }}
                  className="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-white outline-none"
                >
                  <option value="">Single (Phát hành đơn)</option>
                  {albums.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-4">
              <h3 className="text-sm font-bold text-pink-500 flex items-center gap-2">
                <Info className="w-4 h-4" /> Thông tin nâng cao
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                    Mã ISRC
                  </label>
                  <input
                    type="text"
                    value={isrc}
                    disabled
                    className="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-gray-500 outline-none opacity-50 cursor-not-allowed"
                    title="Không thể sửa ISRC sau khi đã phát hành"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                    Ngày phát hành
                  </label>
                  <input
                    type="date"
                    value={releaseDate}
                    onChange={(e) => setReleaseDate(e.target.value)}
                    disabled={!!selectedAlbum}
                    className={`w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-white outline-none ${selectedAlbum ? "opacity-50 cursor-not-allowed" : ""}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                  Lời bài hát (Lyrics)
                </label>
                <textarea
                  rows={4}
                  value={lyrics}
                  onChange={(e) => setLyrics(e.target.value)}
                  className="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-white focus:border-pink-500 outline-none resize-none"
                />
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={isExplicit}
                    onChange={(e) => setIsExplicit(e.target.checked)}
                    className="w-4 h-4 accent-pink-500"
                  />
                  <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                    Nhạy cảm (18+)
                  </span>
                </label>
                <label
                  className={`flex items-center gap-2 group ${selectedAlbum ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    disabled={!!selectedAlbum}
                    className="w-4 h-4 accent-pink-500"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                      Công khai ngay
                    </span>
                    {selectedAlbum && (
                      <span className="text-[10px] text-pink-500 mt-0.5">
                        *Đồng bộ theo Album
                      </span>
                    )}
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-14 bg-pink-500 hover:bg-pink-600 text-white text-lg font-black shadow-[0_0_20px_rgba(236,72,153,0.3)]"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                "Lưu thay đổi"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="h-14 px-8 border-white/10 text-gray-400 hover:text-white bg-transparent"
            >
              Huỷ
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
