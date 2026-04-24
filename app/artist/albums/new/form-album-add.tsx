"use client";

import { Fragment, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

import { AlbumFormMedia } from "../_components/album-form-media";
import { AlbumFormMetadata } from "../_components/album-form-metadata";
import { SuccessModal } from "@/components/modals/success-modal";

import {
  albumFormSchema,
  AlbumFormValues,
} from "@/lib/validations/album.schema";
import { useCreateAlbum } from "@/hooks/use-albums";
import { useGenres } from "@/hooks/use-genres";

export default function FormAlbumAdd() {
  const router = useRouter();
  const { data: genresRes } = useGenres();
  const {
    mutate: createAlbum,
    isPending,
    isError,
    error,
    isSuccess,
  } = useCreateAlbum();

  const form = useForm<AlbumFormValues>({
    resolver: zodResolver(albumFormSchema),
    defaultValues: {
      title: "",
      description: "",
      releaseDate: new Date().toISOString().split("T")[0],
      genreId: "",
      isPublished: false,
    },
  });

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [customError, setCustomError] = useState("");

  const coverInputRef = useRef<HTMLInputElement>(null!);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
      setCustomError("");
    }
  };

  const handleClearCover = () => {
    setCoverFile(null);
    setCoverPreview(null);
    if (coverInputRef.current) coverInputRef.current.value = "";
  };

  const onSubmit = (data: AlbumFormValues) => {
    if (!coverFile) {
      setCustomError("Vui lòng tải lên ảnh bìa cho Album!");
      return;
    }

    setCustomError("");

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("isPublished", String(data.isPublished));
    formData.append("albumType", data.albumType);
    formData.append("isExplicit", String(data.isExplicit));
    formData.append("language", data.language);
    if (data.recordLabel) formData.append("recordLabel", data.recordLabel);
    if (data.copyright) formData.append("copyright", data.copyright);
    if (data.upc) formData.append("upc", data.upc);
    if (data.description) formData.append("description", data.description);
    if (data.releaseDate) formData.append("releaseDate", data.releaseDate);
    if (data.genreId) formData.append("genreId", data.genreId);

    formData.append("coverFile", coverFile);

    createAlbum(formData, {
      onSuccess: () => {
        setTimeout(() => router.push("/artist/albums"), 1500);
      },
    });
  };

  const currentStatus = isPending
    ? "submitting"
    : isSuccess
      ? "success"
      : isError || customError
        ? "error"
        : "idle";

  return (
    <Fragment>
      {(customError || isError) && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 mb-6 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {customError ||
            (error as any)?.message ||
            "Đã có lỗi xảy ra khi tạo Album."}
        </div>
      )}

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        <AlbumFormMedia
          coverPreview={coverPreview}
          coverInputRef={coverInputRef}
          onCoverChange={handleCoverChange}
          onClearCover={handleClearCover}
        />

        <AlbumFormMetadata
          form={form}
          genres={genresRes?.data}
          status={currentStatus}
        />
      </form>

      <SuccessModal
        isOpen={isSuccess}
        title="Tạo Album thành công!"
        description="Đang chuyển hướng về danh sách album..."
        onConfirm={() => router.push("/artist/albums")}
      />
    </Fragment>
  );
}
