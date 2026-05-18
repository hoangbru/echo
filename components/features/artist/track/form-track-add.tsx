"use client";

import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

import { SuccessModal } from "@/components/features/modals";
import { TrackFormMedia } from "./track-form-media";
import { TrackFormMetadata } from "./track-form-metadata";
import { PageHeading } from "@/components/ui/page-heading";

import {
  trackFormSchema,
  TrackFormValues,
} from "@/lib/validations/track.schema";
import { useCreateTrack } from "@/hooks/use-tracks";
import { useAlbumDetail } from "@/hooks/use-albums";

export function FormTrackAdd({ albumId }: { albumId: string }) {
  const router = useRouter();
  const { data: albumRes, isLoading: isLoadingAlbum } = useAlbumDetail(albumId);
  const {
    mutate: createTrack,
    isPending,
    isError,
    error,
    isSuccess,
  } = useCreateTrack(albumId);

  const album = albumRes?.data || null;

  const form = useForm<TrackFormValues>({
    resolver: zodResolver(trackFormSchema),
    defaultValues: {
      albumId: albumId,
      genreId: null,
      title: "",
      trackNumber: 1,
      discNumber: 1,
      isPublished: true,
      isExplicit: false,
      lyrics: "",
      isrc: "",
      composer: "",
      producer: "",
      language: "vi",
      featArtistIds: [],
    },
  });

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [customError, setCustomError] = useState("");
  const [duration, setDuration] = useState<number>(0);

  const onSubmit = (data: TrackFormValues) => {
    if (!audioFile) {
      setCustomError("Vui lòng tải lên file âm thanh (MP3/WAV)!");
      return;
    }
    setCustomError("");

    const formData = new FormData();
    formData.append("albumId", data.albumId);
    formData.append("title", data.title);
    formData.append("trackNumber", String(data.trackNumber));
    formData.append("discNumber", String(data.discNumber));
    formData.append("isPublished", String(data.isPublished));
    formData.append("isExplicit", String(data.isExplicit));
    formData.append("duration", String(duration));

    if (data.genreId) formData.append("genreId", data.genreId);
    if (data.lyrics) formData.append("lyrics", data.lyrics);
    if (data.isrc) formData.append("isrc", data.isrc);
    if (data.composer) formData.append("composer", data.composer);
    if (data.producer) formData.append("producer", data.producer);
    formData.append("language", data.language);

    formData.append("featArtistIds", JSON.stringify(data.featArtistIds));

    formData.append("audioFile", audioFile);
    if (imageFile) formData.append("imageFile", imageFile);

    createTrack(formData, {
      onSuccess: () => {
        setTimeout(() => router.push(`/studio/albums/${albumId}/tracks`), 1500);
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

  if (isLoadingAlbum) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
        <p>Đang tải thông tin...</p>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="text-center py-20 text-red-500">
        Đã có lỗi xảy ra! Vui lòng thử lại.
      </div>
    );
  }

  return (
    <Fragment>
      <PageHeading>
        Thêm bài hát vào:{" "}
        <Link
          href={`/studio/albums/${albumId}/tracks`}
          className="text-primary hover:underline"
        >
          {isLoadingAlbum ? "..." : album?.title || "Unkown"}
        </Link>
      </PageHeading>

      {(customError || isError) && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 mb-6 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {customError || (error as any)?.message || "Đã có lỗi xảy ra."}
        </div>
      )}

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <TrackFormMedia
          audioFile={audioFile}
          setAudioFile={setAudioFile}
          imagePreview={imagePreview}
          setImageFile={setImageFile}
          setImagePreview={setImagePreview}
          setDuration={setDuration}
        />

        <div className="lg:col-span-2">
          <TrackFormMetadata form={form} status={currentStatus} />
        </div>
      </form>

      <SuccessModal
        isOpen={isSuccess}
        title="Thêm bài hát thành công!"
        description="Đang chuyển hướng về danh sách bài hát..."
        onConfirm={() => router.push(`/studio/albums/${albumId}/tracks`)}
      />
    </Fragment>
  );
}
