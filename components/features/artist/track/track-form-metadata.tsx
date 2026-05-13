"use client";

import { UseFormReturn } from "react-hook-form";

import { GenreSelector, LanguageSelector } from "@/components/shared/selectors";
import { SubmitButton } from "@/components/shared/buttons";

import { TrackFormValues } from "@/lib/validations/track.schema";
import { ArtistFeatSelector } from "@/components/shared/selectors";
import { TrackDetail } from "@/types";

interface TrackFormMetadataProps {
  form: UseFormReturn<TrackFormValues>;
  track?: TrackDetail;
  status: string;
}

export function TrackFormMetadata({
  form,
  track,
  status,
}: TrackFormMetadataProps) {
  const {
    register,
    formState: { errors },
  } = form;

  const featArtists = track?.artists
    ? track.artists.filter((a) => !a.isMain)
    : [];

  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
      {/* TÊN BÀI HÁT & SỐ THỨ TỰ */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-8">
          <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
            Tên bài hát *
          </label>
          <input
            {...register("title")}
            placeholder="Nhập tên bài hát..."
            className="flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          />
          {errors.title && (
            <p className="text-destructive text-xs mt-1">
              {errors.title.message}
            </p>
          )}
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
            Bài số
          </label>
          <input
            type="number"
            {...register("trackNumber")}
            className="flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
            Đĩa số
          </label>
          <input
            type="number"
            {...register("discNumber")}
            className="flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors"
          />
        </div>
      </div>

      {/* FEAT ARTISTS */}
      <ArtistFeatSelector form={form} featArtists={featArtists || []} />

      {/* ROW 3: GENRE, LANGUAGE, CHECKBOXES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GenreSelector
          form={form}
          label="Thể loại riêng (Nếu có)"
          placeholder="-- Kế thừa từ Album --"
          emptyOptionLabel="-- Kế thừa từ Album --"
        />

        <LanguageSelector form={form} />

        <div className="space-y-4 pt-2">
          <label className="flex items-center gap-2 cursor-pointer w-fit group">
            <input
              type="checkbox"
              {...register("isPublished")}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm text-foreground group-hover:text-primary transition-colors">
              Phát hành ngay
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer w-fit group">
            <input
              type="checkbox"
              {...register("isExplicit")}
              className="w-4 h-4 accent-destructive"
            />
            <span className="text-sm text-foreground flex items-center gap-1 group-hover:text-destructive transition-colors">
              Chứa nội dung nhạy cảm{" "}
              <span className="bg-destructive/10 text-destructive border border-destructive/20 text-[10px] px-1.5 py-0.5 rounded font-bold">
                E
              </span>
            </span>
          </label>
        </div>
      </div>

      <div className="pt-6 border-t border-border mt-6">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-bold text-muted-foreground uppercase">
            Lời bài hát (Lyrics)
          </label>
          <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded">
            Hỗ trợ định dạng LRC (Time-synced)
          </span>
        </div>
        <textarea
          {...register("lyrics")}
          placeholder="Nhập lời bài hát tĩnh hoặc định dạng LRC (VD: [00:15.20] Câu hát đầu tiên...)"
          className="flex min-h-[200px] w-full rounded-xl border border-input bg-background px-3 py-3 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors resize-y custom-scrollbar"
        />

        {errors.lyrics && (
          <p className="text-destructive text-xs mt-1">
            {errors.lyrics.message}
          </p>
        )}
      </div>

      {/* ROW 4: BẢN QUYỀN */}
      <div className="pt-6 border-t border-border">
        <h3 className="text-sm font-bold text-foreground mb-4">
          Thông tin Bản quyền & Sản xuất
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
              ISRC Code
            </label>
            <input
              {...register("isrc")}
              placeholder="Mã ISRC..."
              className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
              Nhạc sĩ (Composer)
            </label>
            <input
              {...register("composer")}
              placeholder="Người sáng tác..."
              className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
              Nhà sản xuất (Producer)
            </label>
            <input
              {...register("producer")}
              placeholder="Producer..."
              className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <SubmitButton
        isSubmitting={status === "submitting"}
        defaultText="Lưu thay đổi"
        loadingText="Đang lưu..."
      />
    </div>
  );
}
