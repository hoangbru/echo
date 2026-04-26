import { UseFormReturn } from "react-hook-form";
import { TrackFormValues } from "@/lib/validations/track.schema";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface TrackFormMetadataProps {
  form: UseFormReturn<TrackFormValues>;
  artists: any[] | undefined;
  genres: any[] | undefined;
  status: string;
}

export function TrackFormMetadata({
  form,
  artists,
  genres,
  status,
}: TrackFormMetadataProps) {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = form;

  const currentFeats = watch("featArtistIds") || [];
  const toggleFeat = (id: string) => {
    if (currentFeats.includes(id)) {
      setValue(
        "featArtistIds",
        currentFeats.filter((item) => item !== id),
      );
    } else {
      setValue("featArtistIds", [...currentFeats, id]);
    }
  };

  return (
    <div className="bg-card border border-white/5 rounded-2xl p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-8">
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
            Tên bài hát *
          </label>
          <input
            {...register("title")}
            placeholder="Nhập tên bài hát..."
            className="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-pink-500"
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
          )}
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
            Bài số
          </label>
          <input
            type="number"
            {...register("trackNumber")}
            className="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-pink-500"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
            Đĩa số
          </label>
          <input
            type="number"
            {...register("discNumber")}
            className="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-pink-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
          Nghệ sĩ hát chung (Feat)
        </label>
        <div className="h-32 overflow-y-auto bg-[#09090b] border border-white/10 rounded-xl p-2 space-y-1">
          {artists?.length === 0 ? (
            <p className="text-gray-500 text-sm p-2">
              Không có nghệ sĩ nào khác.
            </p>
          ) : (
            artists?.map((artist) => (
              <label
                key={artist.id}
                className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={currentFeats.includes(artist.id)}
                  onChange={() => toggleFeat(artist.id)}
                  className="w-4 h-4 accent-pink-500"
                />
                <span className="text-sm text-gray-200">
                  {artist.stage_name}
                </span>
              </label>
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
            Thể loại riêng (Nếu có)
          </label>
          <select
            {...register("genreId")}
            className="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-pink-500"
          >
            <option value="">-- Kế thừa từ Album --</option>
            {genres?.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
            Ngôn ngữ
          </label>
          <select
            {...register("language")}
            className="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-pink-500"
          >
            <option value="vi">Tiếng Việt</option>
            <option value="en">Tiếng Anh</option>
            <option value="ko">Tiếng Hàn</option>
          </select>
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-2 cursor-pointer w-fit">
            <input
              type="checkbox"
              {...register("isPublished")}
              className="w-4 h-4 accent-pink-500"
            />
            <span className="text-sm text-gray-300">Phát hành ngay</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer w-fit">
            <input
              type="checkbox"
              {...register("isExplicit")}
              className="w-4 h-4 accent-red-500"
            />
            <span className="text-sm text-gray-300 flex items-center gap-1">
              Chứa nội dung nhạy cảm{" "}
              <span className="bg-white/10 text-[10px] px-1.5 py-0.5 rounded text-gray-300">
                E
              </span>
            </span>
          </label>
        </div>
      </div>

      <div className="pt-6 border-t border-white/5">
        <h3 className="text-sm font-bold text-white mb-4">
          Thông tin Bản quyền & Sản xuất
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
              ISRC Code
            </label>
            <input
              {...register("isrc")}
              placeholder="Mã ISRC..."
              className="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-white outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
              Nhạc sĩ (Composer)
            </label>
            <input
              {...register("composer")}
              placeholder="Người sáng tác..."
              className="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-white outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
              Nhà sản xuất (Producer)
            </label>
            <input
              {...register("producer")}
              placeholder="Producer..."
              className="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-white outline-none text-sm"
            />
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end gap-3">
        <Button
          type="submit"
          disabled={status === "submitting"}
          className="bg-pink-500 hover:bg-pink-600 text-white min-w-[150px]"
        >
          {status === "submitting" ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : null}
          {status === "submitting" ? "Đang tải lên..." : "Tải bài hát lên"}
        </Button>
      </div>
    </div>
  );
}
