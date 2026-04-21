import { useRef } from "react";
import Image from "next/image";
import { UploadCloud, X, Music } from "lucide-react";
import { formatDuration } from "@/lib/utils/format";
import { getFileNameFromUrl } from "@/lib/utils/file";

interface TrackEditMediaProps {
  audioUrl: string;
  duration: number | null;
  coverPreview: string | null;
  setCoverPreview: (url: string | null) => void;
  setCoverFile: (file: File | null) => void;
  selectedAlbum?: any;
  oldCoverUrl: string;
}

export function TrackEditMedia({
  audioUrl,
  duration,
  coverPreview,
  setCoverPreview,
  setCoverFile,
  selectedAlbum,
  oldCoverUrl,
}: TrackEditMediaProps) {
  const coverInputRef = useRef<HTMLInputElement>(null!);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleClearCover = () => {
    setCoverFile(null);
    setCoverPreview(selectedAlbum ? selectedAlbum.coverImage : null);
    if (coverInputRef.current) coverInputRef.current.value = "";
  };

  return (
    <div className="space-y-6">
      <div className="bg-card p-6 rounded-2xl border border-white/10">
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
                src={
                  coverPreview ||
                  selectedAlbum?.coverImage ||
                  "/default-cover.jpg"
                }
                alt="Preview"
                fill
                className="object-cover"
              />

              {coverPreview && oldCoverUrl !== selectedAlbum?.coverImage && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClearCover();
                  }}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full z-10 hover:scale-110 shadow-lg transition-transform"
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
              <span className="text-xs text-gray-400">Tải ảnh lên (Vuông)</span>
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

        {selectedAlbum && !coverPreview && (
          <p className="text-xs text-pink-500 mt-3 text-center">
            * Đang sử dụng ảnh bìa của Album
          </p>
        )}
      </div>

      <div className="bg-card p-6 rounded-2xl border border-white/10">
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
              title={getFileNameFromUrl(audioUrl)}
            >
              {getFileNameFromUrl(audioUrl)}
            </p>
            <p className="text-xs text-gray-500">
              Thời lượng: {duration ? formatDuration(duration) : "--:--"}
            </p>
          </div>
        </div>
        <p className="text-[10px] text-gray-500 mt-3 text-center italic text-balance">
          * Không thể thay đổi file âm thanh. Vui lòng xóa bài hát và tải lên
          lại nếu có bản thu âm mới.
        </p>
      </div>
    </div>
  );
}
