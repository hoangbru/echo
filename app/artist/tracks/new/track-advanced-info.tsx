import { UseFormReturn } from "react-hook-form";
import { Info } from "lucide-react";

import { TrackFormValues } from "@/lib/validations/track.schema";
import { AlbumCard } from "@/types";

interface TrackAdvancedInfoProps {
  form: UseFormReturn<TrackFormValues>;
  selectedAlbum?: AlbumCard | null;
}

export function TrackAdvancedInfo({
  form,
  selectedAlbum,
}: TrackAdvancedInfoProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
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
            placeholder="VD: USS1Z2400001"
            {...register("isrc")}
            className="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-white focus:border-pink-500 outline-none transition-colors"
          />
          {errors.isrc && (
            <p className="text-red-500 text-xs mt-1">{errors.isrc.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
            Ngày phát hành
          </label>
          <div className="relative">
            <input
              type="date"
              {...register("release_date")}
              disabled={!!selectedAlbum}
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
            {errors.release_date && (
              <p className="text-red-500 text-xs mt-1">
                {errors.release_date.message}
              </p>
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
          {...register("lyrics")}
          className="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-white focus:border-pink-500 outline-none resize-none transition-colors"
        />
        {errors.lyrics && (
          <p className="text-red-500 text-xs mt-1">{errors.lyrics.message}</p>
        )}
      </div>

      <div className="flex gap-6 pt-2">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            {...register("is_explicit")}
            className="w-4 h-4 accent-pink-500 cursor-pointer"
          />
          <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
            Nội dung nhạy cảm (18+)
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
  );
}
