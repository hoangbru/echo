"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useParams } from "next/navigation";
import {
  UploadCloud,
  Image as ImageIcon,
  Loader2,
  Disc3,
  ChevronLeft,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function EditAlbumPage() {
  const router = useRouter();
  const params = useParams();
  const albumId = params.id;
  const supabase = createClient();

  // States cho Form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [genreId, setGenreId] = useState("");
  const [genres, setGenres] = useState<any[]>([]);
  const [oldCoverUrl, setOldCoverUrl] = useState("");

  // States cho File
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  // States hệ thống & Thông báo
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Fetch dữ liệu Album cũ và danh sách Thể loại
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Thể loại
        const { data: genreData } = await supabase
          .from("Genre")
          .select("id, name");
        if (genreData) setGenres(genreData);

        // Fetch thông tin Album
        const { data: album, error } = await supabase
          .from("Album")
          .select("*")
          .eq("id", albumId)
          .single();

        if (error || !album) throw new Error("Không tìm thấy thông tin album.");

        setTitle(album.title);
        setDescription(album.description || "");
        setGenreId(album.genreId || "");
        setIsPublished(album.isPublished);
        setOldCoverUrl(album.coverImage);
        setCoverPreview(album.coverImage);
        // Format date yyyy-MM-dd để hiển thị trong input date
        if (album.releaseDate) {
          setReleaseDate(
            new Date(album.releaseDate).toISOString().split("T")[0],
          );
        }
      } catch (err: any) {
        setNotification({
          type: "error",
          message:
            "Lỗi tải dữ liệu: Vui lòng kiểm tra lại kết nối hoặc album không tồn tại.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [albumId, supabase]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  // Helper: Lấy path từ URL Supabase để xóa file
  const getPathFromUrl = (url: string) => {
    const parts = url.split("covers/");
    return parts.length > 1 ? parts[1] : null;
  };

  // 2. Xử lý Cập nhật
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setNotification(null);

    let newCoverUrl = oldCoverUrl;
    let newCoverPath: string | null = null;

    try {
      // 1. LẤY USER VÀ ĐẶC BIỆT LÀ ARTIST_ID
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Phiên đăng nhập hết hạn.");

      // Lấy Profile để có ID thực sự của nghệ sĩ (như lúc tạo mới)
      const { data: artistProfile, error: profileErr } = await supabase
        .from("ArtistProfile")
        .select("id")
        .eq("userId", user.id)
        .single();

      if (profileErr || !artistProfile)
        throw new Error("Không tìm thấy hồ sơ nghệ sĩ.");

      // A. Nếu có chọn ảnh mới -> Upload ảnh mới
      if (coverFile) {
        // Tên file an toàn
        const safeName = coverFile.name.replace(/[^a-zA-Z0-9.\-_]/g, "");

        // --- ĐÂY LÀ CHỖ SỬA LỖI ---
        // ĐỒNG BỘ ĐƯỜNG DẪN: Cấu trúc là 'albums/artist_[artist_id]/...'
        // Giống hệt y hệt như lúc tạo mới.
        newCoverPath = `albums/artist_${artistProfile.id}/cover_${Date.now()}_${safeName}`;

        const { error: uploadErr } = await supabase.storage
          .from("covers") // Bucket chính
          .upload(newCoverPath, coverFile);

        if (uploadErr)
          throw new Error("Không thể tải ảnh mới lên kho lưu trữ.");

        newCoverUrl = supabase.storage.from("covers").getPublicUrl(newCoverPath)
          .data.publicUrl;
      }

      // B. Cập nhật Database
      const { error: dbErr } = await supabase
        .from("Album")
        .update({
          title,
          description,
          releaseDate: new Date(releaseDate).toISOString(), // Nhất quán dùng releaseDate
          genreId: genreId || null,
          isPublished,
          coverImage: newCoverUrl, // Tên cột đúng của Album
        })
        .eq("id", albumId);

      if (dbErr) throw new Error("Không thể cập nhật thông tin vào hệ thống.");

      // C. Xóa ảnh cũ trên Storage (nếu đã upload ảnh mới thành công)
      if (coverFile && oldCoverUrl) {
        const oldPath = getPathFromUrl(oldCoverUrl);
        if (oldPath) await supabase.storage.from("covers").remove([oldPath]);
      }

      setNotification({
        type: "success",
        message: "Cập nhật Album thành công! Đang chuyển hướng...",
      });
      setTimeout(() => router.push("/artist/albums"), 1500);
    } catch (err: any) {
      // Rollback: Nếu DB lỗi nhưng đã lỡ up ảnh mới -> Xóa ảnh mới vừa up
      if (newCoverPath)
        await supabase.storage.from("covers").remove([newCoverPath]);

      setNotification({
        type: "error",
        message:
          err.message || "Đã xảy ra lỗi ngoài ý muốn. Vui lòng thử lại sau.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="w-10 h-10 animate-spin text-pink-500 mb-4" />
        <p className="text-gray-400">Đang lấy dữ liệu Album...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6 text-gray-400 hover:text-white pl-0"
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Quay lại
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <Disc3 className="w-8 h-8 text-pink-500" /> Chỉnh sửa Album
        </h1>
      </div>

      {/* CUSTOM NOTIFICATION BANNER */}
      {notification && (
        <div
          className={`mb-6 p-4 rounded-xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
            notification.type === "success"
              ? "bg-green-500/10 border-green-500/20 text-green-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}
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
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {/* Cột trái: Ảnh bìa */}
        <div className="col-span-1">
          <label className="text-sm font-bold text-gray-300 block mb-4">
            Ảnh bìa Album
          </label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center bg-[#18181b] cursor-pointer hover:border-pink-500/50 transition-all relative overflow-hidden group"
          >
            {coverPreview ? (
              <>
                <Image
                  src={coverPreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity">
                  <UploadCloud className="w-8 h-8 text-white mb-2" />
                  <span className="text-xs text-white">Thay đổi ảnh</span>
                </div>
              </>
            ) : (
              <ImageIcon className="w-10 h-10 text-gray-600" />
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            hidden
            accept="image/*"
            onChange={handleFileChange}
          />
          <p className="text-[10px] text-gray-500 mt-3 text-center italic text-balance">
            * Để trống nếu bạn muốn giữ nguyên ảnh bìa cũ
          </p>
        </div>

        {/* Cột phải: Thông tin */}
        <div className="col-span-1 md:col-span-2 space-y-5 bg-[#18181b] p-6 rounded-2xl border border-white/10 shadow-xl">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
              Tên Album *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-white focus:border-pink-500 outline-none transition-all"
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
                <option value="">Chọn thể loại...</option>
                {genres.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                Ngày phát hành
              </label>
              <input
                type="date"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                className="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
              Mô tả
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-white focus:border-pink-500 outline-none resize-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="publish"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="w-4 h-4 accent-pink-500"
            />
            <label
              htmlFor="publish"
              className="text-sm text-gray-300 cursor-pointer"
            >
              Công khai Album này
            </label>
          </div>

          <div className="pt-4 border-t border-white/5 flex gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-14 bg-pink-500 hover:bg-pink-600 font-bold text-lg shadow-[0_0_15px_rgba(236,72,153,0.3)]"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                "Lưu thay đổi"
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.back()}
              className="h-14 px-6 text-gray-400"
            >
              Huỷ
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
