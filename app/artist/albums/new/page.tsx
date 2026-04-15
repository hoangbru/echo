"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  Image as ImageIcon,
  Loader2,
  Disc3,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function NewAlbumPage() {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [releaseDate, setReleaseDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [isPublished, setIsPublished] = useState(false);
  const [genreId, setGenreId] = useState("");
  const [genres, setGenres] = useState<any[]>([]);

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  // State quản lý trạng thái form & thông báo (Đồng bộ với Edit form)
  const [isUploading, setIsUploading] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load danh sách Thể loại
  useEffect(() => {
    supabase
      .from("Genre")
      .select("id, name")
      .then(({ data }) => {
        if (data) setGenres(data);
      });
  }, [supabase]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Loại bỏ alert()
    if (!title || !coverFile) {
      setNotification({
        type: "error",
        message: "Vui lòng điền tên Album và chọn ảnh bìa!",
      });
      return;
    }

    setIsUploading(true);
    setNotification(null); // Reset thông báo cũ
    let uploadedCoverPath: string | null = null;

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Phiên đăng nhập hết hạn.");

      const { data: artist } = await supabase
        .from("ArtistProfile")
        .select("id")
        .eq("userId", user.id)
        .single();
      if (!artist) throw new Error("Lỗi xác thực nghệ sĩ.");

      // 1. Upload ảnh bìa lên bucket 'covers' (Đường dẫn chuẩn: albums/artist_[id]/...)
      const safeName = coverFile.name.replace(/[^a-zA-Z0-9.\-_]/g, "");
      uploadedCoverPath = `albums/artist_${artist.id}/cover_${Date.now()}_${safeName}`;

      const { error: storageError } = await supabase.storage
        .from("covers")
        .upload(uploadedCoverPath, coverFile);
      if (storageError) throw new Error("Không thể tải ảnh lên kho lưu trữ.");

      const coverUrl = supabase.storage
        .from("covers")
        .getPublicUrl(uploadedCoverPath).data.publicUrl;

      // 2. Insert vào DB
      const { error: dbError } = await supabase.from("Album").insert({
        title,
        artistId: artist.id,
        coverImage: coverUrl,
        description: description || null,
        releaseDate: new Date(releaseDate).toISOString(),
        genreId: genreId || null,
        isPublished,
      });

      if (dbError)
        throw new Error("Không thể lưu thông tin Album vào hệ thống.");

      // Thông báo thành công & Chuyển hướng sau 1.5s
      setNotification({
        type: "success",
        message: "Tạo Album thành công! Đang chuyển hướng...",
      });
      setTimeout(() => router.push("/artist/albums"), 1500);
    } catch (err: any) {
      // Rollback ảnh nếu DB lỗi
      if (uploadedCoverPath) {
        await supabase.storage.from("covers").remove([uploadedCoverPath]);
      }
      // Hiển thị lỗi Custom
      setNotification({
        type: "error",
        message:
          err.message || "Đã xảy ra lỗi ngoài ý muốn. Vui lòng thử lại sau.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <Disc3 className="w-8 h-8 text-pink-500" /> Tạo Album mới
        </h1>
        <p className="text-gray-400 mt-2">
          Đóng gói những bản thu âm tốt nhất của bạn thành một kiệt tác.
        </p>
      </div>

      {/* BANNER THÔNG BÁO (Giống hệt form Edit) */}
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
        onSubmit={handleCreate}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {/* Cột trái: Up ảnh */}
        <div className="col-span-1">
          <label className="text-sm font-bold text-gray-300 block mb-4">
            Ảnh bìa Album *
          </label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center bg-[#18181b] cursor-pointer hover:border-pink-500/50 transition-all relative overflow-hidden group"
          >
            {coverPreview ? (
              <Image
                src={coverPreview}
                alt="Cover"
                fill
                className="object-cover"
              />
            ) : (
              <>
                <UploadCloud className="w-10 h-10 text-gray-500 mb-2 group-hover:text-pink-500 transition-colors" />
                <p className="text-xs text-gray-400">
                  Tải ảnh lên (Vuông, &lt;5MB)
                </p>
              </>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            hidden
            onChange={handleFileChange}
          />
        </div>

        {/* Cột phải: Form nhập liệu */}
        <div className="col-span-1 md:col-span-2 space-y-5 bg-[#18181b] p-6 rounded-2xl border border-white/10">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
              Tên Album *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-pink-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                Thể loại chính
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
              Mô tả / Lời nhắn
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-pink-500 resize-none transition-all"
              placeholder="Chia sẻ câu chuyện về Album này..."
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer w-fit">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 accent-pink-500"
              />
              <span className="text-sm text-gray-300">
                Công khai Album (Public)
              </span>
            </label>
          </div>

          <div className="pt-4 border-t border-white/5 flex gap-4">
            <Button
              type="submit"
              disabled={isUploading}
              className="flex-1 h-14 bg-pink-500 hover:bg-pink-600 font-bold text-lg shadow-[0_0_15px_rgba(236,72,153,0.3)]"
            >
              {isUploading ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                "Phát hành Album"
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
