"use client";

import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";

import { SuccessModal } from "@/components/modals/success-modal";
import { TrackFormMedia } from "@/components/artist/track/track-form-media";
import { TrackFormMetadata } from "@/components/artist/track/track-form-metadata";
import { PageHeading } from "@/components/page-heading";

import {
  trackFormSchema,
  TrackFormValues,
} from "@/lib/validations/track.schema";
import { useTrackDetail, useUpdateTrack } from "@/hooks/use-tracks";
import { useGenres } from "@/hooks/use-genres";
import { useAlbumDetail } from "@/hooks/use-albums";
import { useArtists } from "@/hooks/use-artists";

export default function FormTrackEdit({
  albumId,
  trackId,
}: {
  albumId: string;
  trackId: string;
}) {
  const router = useRouter();

  const { data: genresRes, isLoading: isLoadingGenres } = useGenres();
  const { data: artistsRes, isLoading: isLoadingArtists } = useArtists();
  const { data: albumRes, isLoading: isLoadingAlbum } = useAlbumDetail(albumId);
  const { data: trackRes, isLoading: isLoadingTrack } = useTrackDetail(trackId);

  const {
    mutate: updateTrack,
    isPending,
    isError,
    error,
    isSuccess,
  } = useUpdateTrack(albumId);

  const artists = artistsRes?.data || [];
  const genres = genresRes?.data || [];
  const track = trackRes?.data || null;
  const album = albumRes?.data || null;

  const form = useForm<TrackFormValues>({
    resolver: zodResolver(trackFormSchema),
  });

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isRemoveImage, setIsRemoveImage] = useState(false);
  const [duration, setDuration] = useState<number>(0);

  useEffect(() => {
    if (track && album) {
      form.reset({
        albumId: albumId,
        title: track.title,
        trackNumber: track.trackNumber || 0,
        discNumber: track.discNumber || 0,
        genreId: track.genreId || "",
        language: track.language || "",
        isPublished: track.isPublished,
        isExplicit: track.isExplicit,
        isrc: track.isrc || "",
        composer: track.composer || "",
        producer: track.producer || "",
        featArtistIds: track.trackArtists?.map((ta: any) => ta.artist.id) || [],
      });

      setDuration(track.duration);
      setImagePreview(track.imageUrl || null);
    }
  }, [track, album, form, albumId]);

  const handleSetImagePreview = (url: string | null) => {
    setImagePreview(url);
    setIsRemoveImage(url === null);
  };

  const onSubmit = (data: TrackFormValues) => {
    const formData = new FormData();

    formData.append("albumId", albumId);
    formData.append("title", data.title);
    formData.append("trackNumber", String(data.trackNumber));
    formData.append("discNumber", String(data.discNumber));
    formData.append("isPublished", String(data.isPublished));
    formData.append("isExplicit", String(data.isExplicit));
    formData.append("duration", String(duration));
    formData.append("language", data.language);

    formData.append("genreId", data.genreId || "");
    if (data.isrc) formData.append("isrc", data.isrc);
    if (data.composer) formData.append("composer", data.composer);
    if (data.producer) formData.append("producer", data.producer);

    formData.append("featArtistIds", JSON.stringify(data.featArtistIds));

    if (audioFile) formData.append("audioFile", audioFile);
    if (imageFile) formData.append("imageFile", imageFile);
    if (isRemoveImage) formData.append("removeImage", "true");

    updateTrack(
      { id: trackId, formData },
      {
        onSuccess: () => {
          setTimeout(
            () => router.push(`/studio/albums/${albumId}/tracks`),
            1500,
          );
        },
      },
    );
  };

  const currentStatus = isPending
    ? "submitting"
    : isSuccess
      ? "success"
      : isError
        ? "error"
        : "idle";

  if (isLoadingTrack || isLoadingAlbum || isLoadingArtists || isLoadingGenres) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-pink-500" />
        <p>Đang tải thông tin bài hát...</p>
      </div>
    );
  }

  if (!track) {
    return (
      <div className="text-center py-20 text-red-500">
        Không tìm thấy bài hát! Vui lòng thử lại.
      </div>
    );
  }

  return (
    <Fragment>
      <PageHeading>
        Sửa bài hát: <span className="text-pink-500">{track.title}</span>
      </PageHeading>

      {isError && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 mb-6 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {(error as any)?.response?.data?.error || "Đã có lỗi xảy ra."}
        </div>
      )}

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <div className="flex flex-col gap-4">
          <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl text-blue-400 text-sm">
            <p>Bạn đang chỉnh sửa bài hát.</p>
            <p className="mt-1">
              Để trống file âm thanh nếu muốn giữ nguyên bản gốc. Để trống ảnh
              bìa sẽ tự động dùng ảnh của Album.
            </p>
          </div>

          <TrackFormMedia
            audioFile={audioFile}
            setAudioFile={setAudioFile}
            imagePreview={imagePreview}
            setImageFile={setImageFile}
            setImagePreview={handleSetImagePreview}
            setDuration={setDuration}
            initialAudioUrl={track.audioUrl}
          />
        </div>

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
        title="Đã cập nhật bài hát!"
        description="Đang chuyển hướng về danh sách..."
        onConfirm={() => router.push(`/studio/albums/${albumId}/tracks`)}
      />
    </Fragment>
  );
}
