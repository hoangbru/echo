"use client";

import { Controller, UseFormReturn } from "react-hook-form";

import { GenreSelector, LanguageSelector } from "@/components/shared/selectors";
import { SubmitButton } from "@/components/shared/buttons";

import { AlbumFormValues } from "@/lib/validations/album.schema";
import { DatePicker } from "@/components/shared";

interface AlbumFormMetadataProps {
  form: UseFormReturn<AlbumFormValues>;
  status: string;
}

export function AlbumFormMetadata({ form, status }: AlbumFormMetadataProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="col-span-1 md:col-span-2 space-y-5 bg-card p-6 rounded-2xl border border-border">
      {/* TÊN ALBUM */}
      <div>
        <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
          Tên Album *
        </label>
        <input
          type="text"
          {...register("title")}
          placeholder="Nhập tên Album..."
          className="flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors"
        />
        {errors.title && (
          <p className="text-destructive text-xs mt-1">
            {errors.title.message}
          </p>
        )}
      </div>

      {/* LOẠI, THỂ LOẠI & NGÀY PHÁT HÀNH */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
            Loại phát hành *
          </label>
          <select
            {...register("albumType")}
            className="flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors cursor-pointer"
          >
            <option value="SINGLE">Single (1-3 bài)</option>
            <option value="EP">EP (4-6 bài)</option>
            <option value="ALBUM">Album (Trọn bộ)</option>
            <option value="COMPILATION">Tuyển tập (Compilation)</option>
          </select>
          {errors.albumType && (
            <p className="text-destructive text-xs mt-1">
              {errors.albumType.message}
            </p>
          )}
        </div>

        <GenreSelector
          form={form}
          label="Thể loại chính"
          placeholder="Chọn thể loại..."
          emptyOptionLabel="-- Xóa lựa chọn --"
        />

        <div className="space-y-2">
          <label className="block text-xs font-bold text-muted-foreground uppercase">
            Ngày phát hành
          </label>
          <Controller
            name="releaseDate"
            control={form.control}
            render={({ field }) => (
              <DatePicker
                value={field.value}
                onChange={(date) => {
                  field.onChange(date ? date.toISOString() : "");
                }}
                disabled={{ before: new Date(new Date().setHours(0, 0, 0, 0)) }}
                placeholder="Chọn ngày phát hành..."
                className="flex h-12 w-full justify-start items-center rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground font-normal ring-offset-background hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors"
              />
            )}
          />

          {errors.releaseDate && (
            <p className="text-destructive text-xs mt-1">
              {errors.releaseDate.message}
            </p>
          )}
        </div>
      </div>

      {/* MÔ TẢ */}
      <div>
        <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
          Mô tả / Lời nhắn
        </label>
        <textarea
          rows={4}
          {...register("description")}
          placeholder="Chia sẻ câu chuyện về Album này..."
          className="flex min-h-[100px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none transition-colors"
        />
      </div>

      {/* CHECKBOXES */}
      <div className="pt-2 flex flex-col sm:flex-row gap-4 sm:gap-6">
        <label className="flex items-center gap-2 cursor-pointer w-fit group">
          <input
            type="checkbox"
            {...register("isPublished")}
            className="w-4 h-4 accent-primary"
          />
          <span className="text-sm text-foreground group-hover:text-primary transition-colors">
            Công khai Album (Public)
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer w-fit group">
          <input
            type="checkbox"
            {...register("isExplicit")}
            className="w-4 h-4 accent-destructive"
          />
          <span className="text-sm text-foreground flex items-center gap-1 group-hover:text-destructive transition-colors">
            Chứa nội dung nhạy cảm/ngôn từ mạnh{" "}
            <span className="bg-destructive/10 text-destructive border border-destructive/20 text-[10px] px-1.5 py-0.5 rounded font-bold">
              E
            </span>
          </span>
        </label>
      </div>

      {/* BẢN QUYỀN */}
      <div className="pt-6 mt-4 border-t border-border">
        <h3 className="text-sm font-bold text-foreground mb-4">
          Thông tin Bản quyền (Tùy chọn)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
              Hãng đĩa (Record Label)
            </label>
            <input
              type="text"
              {...register("recordLabel")}
              placeholder="VD: Chi Fairy Records"
              className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
              Bản quyền (Copyright)
            </label>
            <input
              type="text"
              {...register("copyright")}
              placeholder="VD: © 2026 Chi Fairy"
              className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
              Mã UPC/EAN
            </label>
            <input
              type="text"
              {...register("upc")}
              placeholder="Mã vạch quốc tế..."
              className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors"
            />
          </div>

          <LanguageSelector form={form} />
        </div>
      </div>

      <div className="flex pt-4">
        <SubmitButton
          isSubmitting={status === "submitting"}
          defaultText="Lưu thay đổi"
          loadingText="Đang lưu..."
          className="w-full sm:w-auto sm:px-8"
        />
      </div>
    </div>
  );
}
