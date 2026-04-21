"use client";

import { useState, useRef, useEffect, Fragment } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";

import { TrackBasicInfo } from "./track-basic-info";
import { TrackAdvancedInfo } from "./track-advanced-info";
import { FileUploader } from "./file-uploader";
import { SuccessModal } from "@/components/modals/success-modal";
import { Button } from "@/components/ui/button";

import {
  trackFormSchema,
  TrackFormValues,
} from "@/lib/validations/track.schema";
import { AlbumCard, GenreDB } from "@/types";
import { TrackService } from "@/lib/services";

type FormProps = {
  genres: GenreDB[];
  albums: AlbumCard[];
  artistId: string;
};

const FormTrackNew = ({ genres, albums, artistId }: FormProps) => {
  const router = useRouter();

  const form = useForm<TrackFormValues>({
    resolver: zodResolver(trackFormSchema),
    defaultValues: {
      title: "",
      is_explicit: false,
      is_published: true,
      release_date: new Date().toISOString().split("T")[0],
    },
  });

  const [musicFile, setMusicFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | null>(null);

  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [countdown, setCountdown] = useState(2);

  const musicInputRef = useRef<HTMLInputElement>(null!);
  const coverInputRef = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    if (status === "success" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 2000);

      return () => clearTimeout(timer);
    } else if (status === "success" && countdown === 0) {
      router.push("/artist/tracks");
    }
  }, [status, countdown, router]);

  const handleMusicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMusicFile(file);
      const audio = new Audio(URL.createObjectURL(file));
      audio.onloadedmetadata = () => setDuration(Math.round(audio.duration));
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleClearCover = () => {
    setCoverFile(null);
    setCoverPreview(null);
    if (coverInputRef.current) {
      coverInputRef.current.value = "";
    }
  };

  const selectedAlbumId = form.watch("album_id");
  const selectedAlbum = albums.find((a) => a.id === selectedAlbumId);

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
    if (!musicFile || (!coverFile && !selectedAlbum)) {
      setErrorMessage("Vui lòng tải lên file nhạc và ảnh bìa!");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    try {
      await TrackService.createTrack({
        formData: data,
        artistId,
        musicFile,
        coverFile,
        selectedAlbumCover: selectedAlbum?.cover_image,
        duration,
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
        <div className="lg:col-span-1">
          <FileUploader
            coverPreview={coverPreview}
            musicFile={musicFile}
            coverInputRef={coverInputRef}
            musicInputRef={musicInputRef}
            onCoverChange={handleCoverChange}
            onMusicChange={handleMusicChange}
            albumCoverUrl={selectedAlbum?.cover_image}
            onClearCover={handleClearCover}
          />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <TrackBasicInfo form={form} albums={albums} genres={genres} />

          <TrackAdvancedInfo form={form} selectedAlbum={selectedAlbum} />

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
        title="Tải lên thành công!"
        description={`Đang chuyển hướng về danh sách bài hát (${countdown}s)...`}
        onConfirm={() => router.push("/artist/tracks")}
      />
    </Fragment>
  );
};

export default FormTrackNew;
