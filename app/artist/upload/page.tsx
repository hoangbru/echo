"use client";

import { useState, useRef, useEffect } from "react";
import {
  UploadCloud,
  Music,
  Image as ImageIcon,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  Info,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ArtistUploadPage() {
  const router = useRouter();
  const supabase = createClient();

  // ================= STATE CHO CÁC TRƯỜNG TRONG DB =================
  const [title, setTitle] = useState("");
  const [isrc, setIsrc] = useState(""); // Mã ISRC mới thêm
  const [albumId, setAlbumId] = useState(""); // Album ID
  const [genreId, setGenreId] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [isExplicit, setIsExplicit] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [releaseDate, setReleasedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  // States cho File & Dữ liệu hỗ trợ
  const [musicFile, setMusicFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [genres, setGenres] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);

  // States hệ thống
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [countdown, setCountdown] = useState(3);

  const musicInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Load Thể loại & Album của nghệ sĩ này
  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Lấy Thể loại
      const { data: genreData } = await supabase
        .from("Genre")
        .select("id, name");
      if (genreData) setGenres(genreData);

      // Lấy Album của nghệ sĩ này (để điền vào dropdown Album)
      const { data: artistProfile } = await supabase
        .from("ArtistProfile")
        .select("id")
        .eq("userId", user.id)
        .single();
      if (artistProfile) {
        const { data: albumData } = await supabase
          .from("Album")
          .select("id, title")
          .eq("artistId", artistProfile.id);
        if (albumData) setAlbums(albumData);
      }
    };
    fetchData();
  }, [supabase]);

  // Luồng tự động điều hướng sau 3s khi thành công
  useEffect(() => {
    if (uploadStatus === "success" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (uploadStatus === "success" && countdown === 0) {
      router.push("/artist/tracks");
    }
  }, [uploadStatus, countdown, router]);

  const handleMusicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMusicFile(file);
      const audio = new Audio(URL.createObjectURL(file));
      audio.onloadedmetadata = () => setDuration(Math.round(audio.duration));
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !musicFile || !coverFile) {
      setErrorMessage("Vui lòng điền tiêu đề và chọn đầy đủ file!");
      setUploadStatus("error");
      return;
    }

    setIsUploading(true);
    let uploadedAudioPath: string | null = null;
    let uploadedCoverPath: string | null = null;

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data: artistProfile } = await supabase
        .from("ArtistProfile")
        .select("id")
        .eq("userId", user?.id!)
        .single();

      if (!artistProfile) throw new Error("Lỗi xác thực nghệ sĩ.");

      // 1. Upload File Âm Thanh
      uploadedAudioPath = `artist_${artistProfile.id}/audio_${Date.now()}`;
      const { error: audioErr } = await supabase.storage
        .from("tracks")
        .upload(uploadedAudioPath, musicFile);
      if (audioErr) throw audioErr;

      // 2. Upload Ảnh Bìa
      uploadedCoverPath = `tracks/artist_${artistProfile.id}/cover_${Date.now()}`;
      const { error: coverErr } = await supabase.storage
        .from("covers")
        .upload(uploadedCoverPath, coverFile);
      if (coverErr) throw coverErr;

      const audioUrl = supabase.storage
        .from("tracks")
        .getPublicUrl(uploadedAudioPath).data.publicUrl;
      const imageUrl = supabase.storage
        .from("covers")
        .getPublicUrl(uploadedCoverPath).data.publicUrl;

      // 3. Insert Record vào bảng Track (Full các trường trong ảnh DB bạn gửi)
      const { error: dbError } = await supabase.from("Track").insert({
        title,
        artistId: artistProfile.id,
        albumId: albumId || null,
        duration,
        audioUrl,
        imageUrl, // Nhớ thêm cột này vào bảng Track như đã bàn
        lyrics: lyrics || null,
        isExplicit,
        genreId: genreId || null,
        isPublished,
        isrc: isrc || null,
        releaseDate: new Date(releaseDate).toISOString(),
      });

      if (dbError) throw dbError;
      setUploadStatus("success");
    } catch (err: any) {
      // ROLLBACK: Xóa file nếu DB bị lỗi
      if (uploadedAudioPath) await supabase.storage.from('tracks').remove([uploadedAudioPath]);
      if (uploadedCoverPath) await supabase.storage.from('covers').remove([uploadedCoverPath]);
      
      // LOG LỖI RA CONSOLE ĐỂ DEV ĐỌC (Người dùng không thấy)
      console.error("Chi tiết lỗi hệ thống:", err);

      // HIỂN THỊ LỖI THÂN THIỆN CHO NGƯỜI DÙNG
      setErrorMessage("Đã có lỗi xảy ra trong quá trình phát hành. Vui lòng kiểm tra lại kết nối mạng hoặc thử lại sau ít phút!");
      setUploadStatus("error");
    } finally {
      setIsUploading(false);
    }
  };

  if (uploadStatus === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">
          Tải lên thành công!
        </h1>
        <p className="text-gray-400">
          Hệ thống sẽ chuyển bạn đến danh sách bài hát trong {countdown}s...
        </p>
        <Button
          onClick={() => router.push("/artist/tracks")}
          className="mt-6 bg-pink-500"
        >
          Chuyển ngay
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-black text-white mb-8">Phát hành bài hát</h1>

      {uploadStatus === "error" && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 mb-6 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" /> {errorMessage}
        </div>
      )}

      <form
        onSubmit={handleUpload}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* CỘT TRÁI: FILES */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#18181b] p-6 rounded-2xl border border-white/10">
            <label className="text-sm font-bold text-gray-300 block mb-4">
              Ảnh bìa (Artwork)
            </label>
            <div
              onClick={() => coverInputRef.current?.click()}
              className="relative aspect-square rounded-xl border-2 border-dashed border-white/10 overflow-hidden cursor-pointer hover:border-pink-500/50 transition-all flex flex-col items-center justify-center bg-[#09090b]"
            >
              {coverPreview ? (
                <Image
                  src={coverPreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              ) : (
                <ImageIcon className="w-10 h-10 text-gray-600" />
              )}
            </div>
            <input
              type="file"
              ref={coverInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleCoverChange}
            />
          </div>

          <div className="bg-[#18181b] p-6 rounded-2xl border border-white/10">
            <label className="text-sm font-bold text-gray-300 block mb-4">
              File âm thanh
            </label>
            <Button
              type="button"
              variant="outline"
              onClick={() => musicInputRef.current?.click()}
              className="w-full h-14 border-pink-500/30 text-pink-500 hover:bg-pink-500/10"
            >
              <Music className="w-4 h-4 mr-2" />{" "}
              {musicFile ? "Đã chọn 1 file" : "Chọn file nhạc"}
            </Button>
            <input
              type="file"
              ref={musicInputRef}
              className="hidden"
              accept="audio/*"
              onChange={handleMusicChange}
            />
            {musicFile && (
              <p className="text-[10px] text-gray-500 mt-2 truncate">
                {musicFile.name}
              </p>
            )}
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
                  Album (Nếu có)
                </label>
                <select
                  value={albumId}
                  onChange={(e) => setAlbumId(e.target.value)}
                  className="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-white outline-none"
                >
                  <option value="">Single (Không thuộc album)</option>
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
                    onChange={(e) => setIsrc(e.target.value)}
                    placeholder="VD: USS1Z2400001"
                    className="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-white focus:border-pink-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                    Ngày phát hành
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={releaseDate}
                      onChange={(e) => setReleasedDate(e.target.value)}
                      className="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-white outline-none"
                    />
                  </div>
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
                    Nội dung nhạy cảm (18+)
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-4 h-4 accent-pink-500"
                  />
                  <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                    Công khai ngay lập tức
                  </span>
                </label>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isUploading}
            className="w-full h-16 bg-pink-500 hover:bg-pink-600 text-white text-lg font-black shadow-[0_0_20px_rgba(236,72,153,0.3)]"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-6 h-6 mr-2 animate-spin" /> Đang tải
                lên...
              </>
            ) : (
              "Bắt Đầu Phát Hành"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
