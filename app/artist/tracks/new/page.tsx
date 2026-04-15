"use client";

import { useState, useRef, useEffect } from "react";
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  Info,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Import các component vừa tách
import { AlbumSelector } from "./album-selector";
import { FileUploader } from "./file-uploader";

export default function ArtistUploadPage() {
  const router = useRouter();
  const supabase = createClient();

  // States DB
  const [title, setTitle] = useState("");
  const [isrc, setIsrc] = useState("");
  const [albumId, setAlbumId] = useState("");
  const [genreId, setGenreId] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [isExplicit, setIsExplicit] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [releaseDate, setReleaseDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  // States File & Dữ liệu
  const [musicFile, setMusicFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [genres, setGenres] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);

  // States Hệ thống
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [countdown, setCountdown] = useState(3);

  const musicInputRef = useRef<HTMLInputElement>(null!);
  const coverInputRef = useRef<HTMLInputElement>(null!);

  // Load Dữ liệu
  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: genreData } = await supabase
        .from("Genre")
        .select("id, name");
      if (genreData) setGenres(genreData);

      const { data: artistProfile } = await supabase
        .from("ArtistProfile")
        .select("id")
        .eq("userId", user.id)
        .single();
      if (artistProfile) {
        // Đã bổ sung lấy coverImage và isPublished
        const { data: albumData } = await supabase
          .from("Album")
          .select("id, title, coverImage, isPublished")
          .eq("artistId", artistProfile.id)
          .order("createdAt", { ascending: false });
        if (albumData) setAlbums(albumData);
      }
    };
    fetchData();
  }, [supabase]);

  // Tìm thông tin của Album đang được chọn
  const selectedAlbum = albums.find((a) => a.id === albumId);

  // TỰ ĐỘNG ĐỒNG BỘ TRẠNG THÁI THEO ALBUM
  useEffect(() => {
    if (selectedAlbum) {
      setIsPublished(selectedAlbum.isPublished);
      // Đồng bộ ngày phát hành từ album (cắt lấy phần yyyy-mm-dd)
      if (selectedAlbum.releaseDate) {
        setReleaseDate(
          new Date(selectedAlbum.releaseDate).toISOString().split("T")[0],
        );
      }
    }
  }, [albumId, selectedAlbum]);

  // Điều hướng thành công
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

  const handleClearCover = () => {
    setCoverFile(null);
    setCoverPreview(null);
    if (coverInputRef.current) {
      coverInputRef.current.value = "";
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    // ĐỔI LOGIC VALIDATE: Bắt buộc có ảnh bìa CHỈ KHI không chọn Album
    if (!title || !musicFile || (!coverFile && !selectedAlbum)) {
      setErrorMessage(
        "Vui lòng điền tiêu đề, chọn file nhạc và ảnh bìa (nếu phát hành Single)!",
      );
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

      // 1. UPLOAD NHẠC (Giữ nguyên)
      const safeName = musicFile.name.replace(/[^a-zA-Z0-9.\-_]/g, "");
      uploadedAudioPath = `artist_${artistProfile.id}/audio_${Date.now()}_${safeName}`;
      const { error: audioErr } = await supabase.storage
        .from("tracks")
        .upload(uploadedAudioPath, musicFile);
      if (audioErr) throw audioErr;
      const audioUrl = supabase.storage
        .from("tracks")
        .getPublicUrl(uploadedAudioPath).data.publicUrl;

      // 2. XỬ LÝ ẢNH BÌA THÔNG MINH
      let trackImageUrl = "";

      if (coverFile) {
        // Trường hợp A: Nghệ sĩ cố tình chọn ảnh bìa riêng -> Up file mới
        uploadedCoverPath = `tracks/artist_${artistProfile.id}/cover_${Date.now()}`;
        const { error: coverErr } = await supabase.storage
          .from("covers")
          .upload(uploadedCoverPath, coverFile);
        if (coverErr) throw coverErr;
        trackImageUrl = supabase.storage
          .from("covers")
          .getPublicUrl(uploadedCoverPath).data.publicUrl;
      } else if (selectedAlbum) {
        // Trường hợp B: Không chọn ảnh riêng, nhưng có thuộc Album -> Tái sử dụng URL của Album!
        trackImageUrl = selectedAlbum.coverImage;
      }

      // 3. LƯU DATABASE
      const { error: dbError } = await supabase.from("Track").insert({
        title,
        artistId: artistProfile.id,
        albumId: albumId || null,
        duration,
        audioUrl,
        imageUrl: trackImageUrl, // Dùng biến thông minh vừa tạo
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
      if (uploadedAudioPath)
        await supabase.storage.from("tracks").remove([uploadedAudioPath]);
      if (uploadedCoverPath)
        await supabase.storage.from("covers").remove([uploadedCoverPath]);
      setErrorMessage(
        "Đã có lỗi xảy ra trong quá trình phát hành. Vui lòng thử lại!",
      );
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
        <p className="text-gray-400">Chuyển hướng trong {countdown}s...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6 text-gray-400 hover:text-white pl-0"
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Quay lại
      </Button>
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
        {/* CỘT TRÁI: Dùng component FileUploader */}
        <div className="lg:col-span-1">
          <FileUploader
            coverPreview={coverPreview}
            musicFile={musicFile}
            coverInputRef={coverInputRef}
            musicInputRef={musicInputRef}
            onCoverChange={handleCoverChange}
            onMusicChange={handleMusicChange}
            albumCoverUrl={selectedAlbum?.coverImage}
            onClearCover={handleClearCover}
          />
        </div>

        {/* CỘT PHẢI: METADATA */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#18181b] p-8 rounded-2xl border border-white/10 space-y-6">
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

            {/* DÙNG COMPONENT ALBUM SELECTOR MỚI */}
            <AlbumSelector
              albums={albums}
              selectedAlbumId={albumId}
              onSelect={setAlbumId}
            />

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
                      onChange={(e) => setReleaseDate(e.target.value)}
                      disabled={!!selectedAlbum} // Khóa khi có album
                      className={`w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-white outline-none transition-all ${
                        selectedAlbum
                          ? "opacity-50 cursor-not-allowed"
                          : "focus:border-pink-500"
                      }`}
                    />
                    {selectedAlbum && (
                      <span className="text-[10px] text-pink-500 mt-1 block">
                        *Đã khóa theo ngày phát hành của Album
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                  Lời bài hát
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

                {/* LOGIC KHÓA CHECKBOX CÔNG KHAI KHI CÓ ALBUM */}
                <label
                  className={`flex items-center gap-2 group ${selectedAlbum ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    disabled={!!selectedAlbum} // Khóa nếu có chọn Album
                    className="w-4 h-4 accent-pink-500"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                      Công khai ngay lập tức
                    </span>
                    {selectedAlbum && (
                      <span className="text-[10px] text-pink-500 mt-0.5">
                        *Được đồng bộ theo trạng thái của Album
                      </span>
                    )}
                  </div>
                </label>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-white/5 flex gap-4">
            <Button
              type="submit"
              disabled={isUploading}
              className="flex-1 h-14 bg-pink-500 hover:bg-pink-600 font-bold text-lg shadow-[0_0_15px_rgba(236,72,153,0.3)]"
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
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push("/artist/tracks")}
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
