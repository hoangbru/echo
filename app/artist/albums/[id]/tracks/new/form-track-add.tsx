"use client";

import { Fragment, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";

import { SuccessModal } from "@/components/modals/success-modal";
import { TrackFormMedia } from "@/components/artist/track/track-form-media";
import { TrackFormMetadata } from "@/components/artist/track/track-form-metadata";

import {
  trackFormSchema,
  TrackFormValues,
} from "@/lib/validations/track.schema";
import { useCreateTrack } from "@/hooks/use-tracks";
import { useGenres } from "@/hooks/use-genres";
import { PageHeading } from "@/components/page-heading";
import { useAlbumDetail } from "@/hooks/use-albums";
import { useArtists } from "@/hooks/use-artists";

export default function FormTrackAdd({ albumId }: { albumId: string }) {
  const router = useRouter();
  const { data: genresRes, isLoading: isLoadingGenres } = useGenres();
  const { data: artistsRes, isLoading: isLoadingArtists } = useArtists();
  const { data: albumRes, isLoading: isLoadingAlbum } = useAlbumDetail(albumId);
  const {
    mutate: createTrack,
    isPending,
    isError,
    error,
    isSuccess,
  } = useCreateTrack(albumId);

  const genres = genresRes?.data || [];
  const artists = artistsRes?.data || [];
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
    if (data.isrc) formData.append("isrc", data.isrc);
    if (data.composer) formData.append("composer", data.composer);
    if (data.producer) formData.append("producer", data.producer);
    formData.append("language", data.language);

    formData.append("featArtistIds", JSON.stringify(data.featArtistIds));

    formData.append("audioFile", audioFile);
    if (imageFile) formData.append("imageFile", imageFile);

    createTrack(formData, {
      onSuccess: () => {
        setTimeout(() => router.push(`/artist/albums/${albumId}/tracks`), 1500);
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

  if (isLoadingGenres || isLoadingAlbum || isLoadingArtists) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-pink-500" />
        <p>Đang tải thông tin...</p>
      </div>
    );
  }

  if (!genres || !artists || !album) {
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
        <span className="text-pink-500">
          {isLoadingAlbum ? "..." : album?.title || "Unkown"}
        </span>
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
          <TrackFormMetadata
            form={form}
            artists={artists}
            genres={genres}
            status={currentStatus}
          />
        </div>
      </form>

      <SuccessModal
        isOpen={isSuccess}
        title="Thêm bài hát thành công!"
        description="Đang chuyển hướng về danh sách bài hát..."
        onConfirm={() => router.push(`/artist/albums/${albumId}/tracks`)}
      />
    </Fragment>
  );
}
