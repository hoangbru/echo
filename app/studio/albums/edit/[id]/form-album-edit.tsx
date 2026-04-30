"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";

import { SuccessModal } from "@/components/modals/success-modal";
import { AlbumFormMedia } from "@/components/artist/album/album-form-media";
import { AlbumFormMetadata } from "@/components/artist/album/album-form-metadata";

import {
  albumFormSchema,
  AlbumFormValues,
} from "@/lib/validations/album.schema";
import { useAlbumDetail, useUpdateAlbum } from "@/hooks/use-albums";
import { useGenres } from "@/hooks/use-genres";

export default function FormAlbumEdit({ albumId }: { albumId: string }) {
  const router = useRouter();

  const { data: genresRes } = useGenres();
  const { data: albumRes, isLoading: isLoadingAlbum } = useAlbumDetail(albumId);
  const {
    mutate: updateAlbum,
    isPending,
    isSuccess,
    isError,
    error,
  } = useUpdateAlbum(albumId);

  const form = useForm<AlbumFormValues>({
    resolver: zodResolver(albumFormSchema),
  });

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    if (albumRes?.data) {
      const album = albumRes.data;

      form.reset({
        title: album.title,
        description: album.description || "",
        releaseDate: album.releaseDate ? album.releaseDate.split("T")[0] : "",
        genreId: album.genreId || "",
        isPublished: album.isPublished || false,
        isExplicit: album.isExplicit || false,
        albumType: album.albumType || "ALBUM",

        recordLabel: album.recordLabel || "",
        copyright: album.copyright || "",
        upc: album.upc || "",
        language: album.language || "vi",
      });

      setCoverPreview(album.coverImage);
    }
  }, [albumRes, form]);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = (data: AlbumFormValues) => {
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

    if (coverFile) {
      formData.append("coverFile", coverFile);
    }

    updateAlbum(formData, {
      onSuccess: () => setTimeout(() => router.push("/studio/albums"), 1500),
    });
  };

  if (isLoadingAlbum) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
      </div>
    );
  }

  const currentStatus = isPending
    ? "submitting"
    : isSuccess
      ? "success"
      : isError
        ? "error"
        : "idle";

  return (
    <Fragment>
      {isError && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 mb-6 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />{" "}
          {(error as any)?.message || "Lỗi cập nhật."}
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
          onClearCover={() => {
            setCoverFile(null);
            setCoverPreview(null);
          }}
        />

        <AlbumFormMetadata
          form={form}
          genres={genresRes?.data || []}
          status={currentStatus}
        />
      </form>

      <SuccessModal
        isOpen={isSuccess}
        title="Cập nhật Album thành công!"
        description="Đang chuyển hướng về danh sách album..."
        onConfirm={() => router.push("/studio/albums")}
      />
    </Fragment>
  );
}
