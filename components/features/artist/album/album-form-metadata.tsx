"use client";

import { useRouter } from "next/navigation";
import { UseFormReturn } from "react-hook-form";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { AlbumFormValues } from "@/lib/validations/album.schema";

interface AlbumFormMetadataProps {
  form: UseFormReturn<AlbumFormValues>;
  genres: any[] | undefined;
  status: string;
}

export function AlbumFormMetadata({
  form,
  genres,
  status,
}: AlbumFormMetadataProps) {
  const router = useRouter();
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="col-span-1 md:col-span-2 space-y-5 bg-card p-6 rounded-2xl border border-white/10">
      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
          Tên Album *
        </label>
        <input
          type="text"
          {...register("title")}
          className="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-pink-500 transition-all"
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
            Loại phát hành *
          </label>
          <select
            {...register("albumType")}
            className="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-pink-500"
          >
            <option value="SINGLE">Single (1-3 bài)</option>
            <option value="EP">EP (4-6 bài)</option>
            <option value="ALBUM">Album (Trọn bộ)</option>
            <option value="COMPILATION">Tuyển tập (Compilation)</option>
          </select>
          {errors.albumType && (
            <p className="text-red-500 text-xs mt-1">
              {errors.albumType.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
            Thể loại chính
          </label>
          <select
            {...register("genreId")}
            className="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-pink-500 transition-all"
          >
            <option value="">Chọn thể loại...</option>
            {genres?.map((g) => (
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
            {...register("releaseDate")}
            className="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-pink-500 transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
          Mô tả / Lời nhắn
        </label>
        <textarea
          rows={4}
          {...register("description")}
          className="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-pink-500 resize-none transition-all"
          placeholder="Chia sẻ câu chuyện về Album này..."
        />
      </div>

      <div className="pt-2 flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer w-fit">
          <input
            type="checkbox"
            {...register("isPublished")}
            className="w-4 h-4 accent-pink-500"
          />
          <span className="text-sm text-gray-300">
            Công khai Album (Public)
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer w-fit">
          <input
            type="checkbox"
            {...register("isExplicit")}
            className="w-4 h-4 accent-red-500"
          />
          <span className="text-sm text-gray-300 flex items-center gap-1">
            Chứa nội dung nhạy cảm/ngôn từ mạnh{" "}
            <span className="bg-white/10 text-[10px] px-1.5 py-0.5 rounded text-gray-300">
              E
            </span>
          </span>
        </label>
      </div>

      <div className="pt-6 mt-4 border-t border-white/5">
        <h3 className="text-sm font-bold text-white mb-4">
          Thông tin Bản quyền (Tùy chọn)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
              Hãng đĩa (Record Label)
            </label>
            <input
              type="text"
              {...register("recordLabel")}
              placeholder="VD: Chi Fairy Records"
              className="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-pink-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
              Bản quyền (Copyright)
            </label>
            <input
              type="text"
              {...register("copyright")}
              placeholder="VD: © 2026 Chi Fairy"
              className="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-pink-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
              Mã UPC/EAN
            </label>
            <input
              type="text"
              {...register("upc")}
              placeholder="Mã vạch quốc tế..."
              className="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-pink-500"
            />
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
              <option value="ja">Tiếng Nhật</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={status === "submitting"}
          className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-bold px-6 shadow-[0_0_20px_rgba(236,72,153,0.3)]"
        >
          {status === "submitting" ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            "Lưu thay đổi"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="px-8 border-white/10 text-gray-400 hover:text-white bg-transparent"
        >
          Huỷ
        </Button>
      </div>
    </div>
  );
}
