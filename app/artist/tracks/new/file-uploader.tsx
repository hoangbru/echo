import { UploadCloud, Music, Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { RefObject } from "react";

interface FileUploaderProps {
  coverPreview: string | null;
  musicFile: File | null;
  coverInputRef: RefObject<HTMLInputElement>;
  musicInputRef: RefObject<HTMLInputElement>;
  onCoverChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMusicChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  albumCoverUrl?: string | null;
  onClearCover: () => void;
}

export function FileUploader({
  coverPreview,
  musicFile,
  coverInputRef,
  musicInputRef,
  onCoverChange,
  onMusicChange,
  albumCoverUrl,
  onClearCover,
}: FileUploaderProps) {
  const displayImage = coverPreview || albumCoverUrl;

  return (
    <div className="space-y-6">
      <div className="bg-card p-6 rounded-2xl border border-white/10">
        <label className="text-sm font-bold text-gray-300 block mb-4">
          Ảnh bìa (Artwork){" "}
          {albumCoverUrl && !coverPreview ? (
            <span className="text-pink-500 text-xs font-normal ml-2">
              (Sử dụng ảnh Album)
            </span>
          ) : (
            "*"
          )}
        </label>
        <div
          onClick={() => coverInputRef.current?.click()}
          className={`relative aspect-square rounded-xl border-2 overflow-hidden cursor-pointer transition-all flex flex-col items-center justify-center group ${
            displayImage
              ? "border-transparent"
              : "border-dashed border-white/10 hover:border-pink-500/50 bg-[#09090b]"
          }`}
        >
          {displayImage ? (
            <>
              <Image
                src={displayImage}
                alt="Preview"
                fill
                className="object-cover"
              />
              {coverPreview && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClearCover();
                  }}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full z-10 transition-transform hover:scale-110 shadow-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                <UploadCloud className="w-8 h-8 text-white mb-2" />
                <span className="text-xs text-white">
                  Đổi ảnh riêng cho bài này
                </span>
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
          onChange={onCoverChange}
        />
        {albumCoverUrl && !coverPreview && (
          <Button
            variant="ghost"
            className="w-full mt-3 text-xs text-gray-400 h-8"
            onClick={() => {}}
          >
            Kế thừa ảnh bìa từ Album
          </Button>
        )}
      </div>

      <div className="bg-card p-6 rounded-2xl border border-white/10">
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
          onChange={onMusicChange}
        />
        {musicFile && (
          <p className="text-[10px] text-gray-500 mt-2 truncate text-center">
            {musicFile.name}
          </p>
        )}
      </div>
    </div>
  );
}
