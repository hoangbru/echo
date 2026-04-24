import { RefObject } from "react";
import Image from "next/image";
import { UploadCloud, X } from "lucide-react";

interface AlbumFormMediaProps {
  coverPreview: string | null;
  coverInputRef: RefObject<HTMLInputElement>;
  onCoverChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearCover: () => void;
}

export function AlbumFormMedia({
  coverPreview,
  coverInputRef,
  onCoverChange,
  onClearCover,
}: AlbumFormMediaProps) {
  return (
    <div className="col-span-1">
      <div className="bg-card p-6 rounded-2xl border border-white/10">
        <label className="text-sm font-bold text-gray-300 block mb-4">
          Ảnh bìa (Artwork) *
        </label>
        <div
          onClick={() => coverInputRef.current?.click()}
          className={`relative aspect-square rounded-xl border-2 overflow-hidden cursor-pointer transition-all flex flex-col items-center justify-center group ${
            coverPreview
              ? "border-transparent"
              : "border-dashed border-white/10 hover:border-pink-500/50 bg-[#09090b]"
          }`}
        >
          {coverPreview ? (
            <>
              <Image
                src={coverPreview}
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
      </div>
    </div>
  );
}
