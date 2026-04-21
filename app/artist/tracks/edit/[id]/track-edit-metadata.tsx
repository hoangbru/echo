import { UseFormReturn } from "react-hook-form";
import { Info } from "lucide-react";

import { TrackFormValues } from "@/lib/validations/track.schema";
import { AlbumSelector } from "../../new/album-selector";

interface TrackEditMetadataProps {
  form: UseFormReturn<TrackFormValues>;
  genres: any[];
  albums: any[];
  selectedAlbum?: any;
  originalIsrc?: string;
}

export function TrackEditMetadata({
  form,
  genres,
  albums,
  selectedAlbum,
  originalIsrc,
}: TrackEditMetadataProps) {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = form;

  const currentAlbumId = watch("album_id");

  return (
    <div className="bg-card p-8 rounded-2xl border border-white/10 space-y-5">
      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
          Tiêu đề bài hát *
        </label>
        <input
          type="text"
          {...register("title")}
          className="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-white focus:border-pink-500 outline-none"
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Album */}
      <AlbumSelector
        albums={albums}
        selectedAlbumId={currentAlbumId || ""}
        onSelect={(id) => {
          setValue("album_id", id, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }}
      />

      {/* Thể loại */}
      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
          Thể loại
        </label>
        <select
          {...register("genre_id")}
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
          {/* ISRC */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
              Mã ISRC
            </label>
            <input
              type="text"
              value={originalIsrc || ""}
              disabled
              className="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-gray-500 outline-none opacity-50 cursor-not-allowed"
              title="Không thể sửa ISRC sau khi đã phát hành"
            />
          </div>

          {/* Ngày phát hành */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
              Ngày phát hành
            </label>
            <input
              type="date"
              {...register("release_date")}
              disabled={!!selectedAlbum}
              className={`w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-white outline-none ${
                selectedAlbum
                  ? "opacity-50 cursor-not-allowed"
                  : "focus:border-pink-500"
              }`}
            />
          </div>
        </div>

        {/* Lời bài hát */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
            Lời bài hát (Lyrics)
          </label>
          <textarea
            rows={4}
            {...register("lyrics")}
            className="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-white focus:border-pink-500 outline-none resize-none"
          />
        </div>

        {/* Toggles (Checkboxes) */}
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              {...register("is_explicit")}
              className="w-4 h-4 accent-pink-500"
            />
            <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
              Nhạy cảm (18+)
            </span>
          </label>

          <label
            className={`flex items-center gap-2 group ${
              selectedAlbum ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            <input
              type="checkbox"
              {...register("is_published")}
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
  );
}
