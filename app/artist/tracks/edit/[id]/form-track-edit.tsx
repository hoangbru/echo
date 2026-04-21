"use client";

import { useState, useEffect, Fragment } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";

import { TrackEditMedia } from "./track-edit-media";
import { TrackEditMetadata } from "./track-edit-metadata";
import { Button } from "@/components/ui/button";
import { SuccessModal } from "@/components/modals/success-modal";

import {
  trackFormSchema,
  TrackFormValues,
} from "@/lib/validations/track.schema";
import { TrackService } from "@/lib/services";

export default function FormTrackEdit({
  track,
  genres,
  albums,
  artistId,
}: any) {
  const router = useRouter();

  const form = useForm<TrackFormValues>({
    resolver: zodResolver(trackFormSchema),
    defaultValues: {
      title: track.title || "",
      album_id: track.album_id || "",
      genre_id: track.genre_id || "",
      lyrics: track.lyrics || "",
      is_explicit: track.is_explicit,
      is_published: track.is_published,
      release_date: track.release_date
        ? new Date(track.release_date).toISOString().split("T")[0]
        : "",
    },
  });

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(
    track.image_url,
  );

  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [countdown, setCountdown] = useState(2);

  useEffect(() => {
    if (status === "success" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 2000);

      return () => clearTimeout(timer);
    } else if (status === "success" && countdown === 0) {
      router.push("/artist/tracks");
    }
  }, [status, countdown, router]);

  const selectedAlbumId = form.watch("album_id");
  const selectedAlbum = albums.find((a: any) => a.id === selectedAlbumId);

  useEffect(() => {
    if (selectedAlbum) {
      form.setValue("is_published", selectedAlbum.is_published);
      if (selectedAlbum.release_date) {
        form.setValue(
          "release_date",
          new Date(selectedAlbum.release_date).toISOString().split("T")[0],
        );
      }
    }
  }, [selectedAlbumId, selectedAlbum, form]);

  const onSubmit = async (data: TrackFormValues) => {
    const clearCustomCover = !coverPreview && !!selectedAlbum;
    setStatus("submitting");
    try {
      await TrackService.updateTrack({
        trackId: track.id,
        artistId,
        formData: data,
        coverFile,
        oldCoverUrl: track.image_url,
        clearCustomCover,
        albumCoverUrl: selectedAlbum?.coverImage,
      });

      setStatus("success");
    } catch (err: any) {
      setErrorMessage(err.message || "Đã có lỗi xảy ra.");
      setStatus("error");
    }
  };

  return (
    <Fragment>
      {status === "error" && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 mb-6 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" /> {errorMessage}
        </div>
      )}

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <div className="lg:col-span-1 space-y-6">
          <TrackEditMedia
            audioUrl={track.audio_url}
            duration={track.duration}
            coverPreview={coverPreview}
            setCoverPreview={setCoverPreview}
            setCoverFile={setCoverFile}
            selectedAlbum={selectedAlbum}
            oldCoverUrl={track.image_url}
          />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <TrackEditMetadata
            form={form}
            genres={genres}
            albums={albums}
            selectedAlbum={selectedAlbum}
            originalIsrc={track.isrc}
          />

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
      </form>

      <SuccessModal
        isOpen={status === "success"}
        title="Cập nhật thành công!"
        description={`Đang chuyển hướng về danh sách bài hát (${countdown}s)...`}
        onConfirm={() => router.push("/artist/tracks")}
      />
    </Fragment>
  );
}
