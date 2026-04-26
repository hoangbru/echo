"use client";

import { useRef, useMemo } from "react";
import Image from "next/image";
import { UploadCloud, Music, X, ImageIcon, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TrackFormMediaProps {
  audioFile: File | null;
  setAudioFile: (file: File | null) => void;
  imagePreview: string | null;
  setImageFile: (file: File | null) => void;
  setImagePreview: (url: string | null) => void;
  setDuration: (duration: number) => void;
  initialAudioUrl?: string | null;
}

export function TrackFormMedia({
  audioFile,
  setAudioFile,
  imagePreview,
  setImageFile,
  setImagePreview,
  setDuration,
  initialAudioUrl,
}: TrackFormMediaProps) {
  const audioInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const audioPreviewUrl = useMemo(() => {
    if (audioFile) return URL.createObjectURL(audioFile);
    if (initialAudioUrl) return initialAudioUrl;
    return null;
  }, [audioFile, initialAudioUrl]);

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAudioFile(file);

      const audio = new Audio(URL.createObjectURL(file));
      audio.onloadedmetadata = () => {
        setDuration(Math.round(audio.duration));
      };
    }
  };

  const handleClearAudio = () => {
    setAudioFile(null);
    if (audioInputRef.current) audioInputRef.current.value = "";
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleClearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-card border border-white/5 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Music className="w-4 h-4 text-pink-500" />
          File âm thanh *
        </h3>

        <input
          type="file"
          accept="audio/mpeg, audio/wav, audio/flac"
          className="hidden"
          ref={audioInputRef}
          onChange={handleAudioChange}
        />

        {audioFile || initialAudioUrl ? (
          <div className="bg-[#09090b] border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1 min-w-0 pr-4">
                <p className="text-sm font-medium text-white truncate">
                  {audioFile
                    ? audioFile.name
                    : "File âm thanh hiện tại (Bản gốc)"}
                </p>
                {audioFile && (
                  <p className="text-xs text-gray-500 mt-1">
                    {(audioFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                )}
              </div>

              {audioFile ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleClearAudio}
                  className="text-gray-400 hover:text-foreground shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => audioInputRef.current?.click()}
                  className="text-pink-500 hover:text-foreground shrink-0 text-xs gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Đổi file
                </Button>
              )}
            </div>

            {audioPreviewUrl && (
              <audio
                controls
                className="w-full h-10 outline-none"
                key={audioPreviewUrl}
              >
                <source src={audioPreviewUrl} />
              </audio>
            )}
          </div>
        ) : (
          <div
            onClick={() => audioInputRef.current?.click()}
            className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-pink-500/50 hover:bg-pink-500/5 transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:bg-pink-500/20">
              <UploadCloud className="w-6 h-6 text-gray-400 group-hover:text-pink-500 transition-colors" />
            </div>
            <p className="text-sm font-medium text-gray-300">
              Nhấn để chọn file nhạc
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Hỗ trợ .mp3, .wav, .flac (Tối đa 50MB)
            </p>
          </div>
        )}
      </div>

      <div className="bg-card border border-white/5 rounded-2xl p-6">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-pink-500" />
            Ảnh bìa riêng (Tùy chọn)
          </h3>
          <p className="text-xs text-gray-500 mt-1 mb-4">
            Nếu để trống, hệ thống sẽ tự động dùng ảnh bìa của Album.
          </p>
        </div>

        <input
          type="file"
          accept="image/jpeg, image/png, image/webp"
          className="hidden"
          ref={imageInputRef}
          onChange={handleImageChange}
        />

        {imagePreview ? (
          <div className="relative aspect-square w-full max-w-[240px] mx-auto rounded-xl overflow-hidden border border-white/10 group">
            <Image
              src={imagePreview}
              alt="Track Cover Preview"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={handleClearImage}
                className="rounded-full w-10 h-10"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => imageInputRef.current?.click()}
            className="aspect-square w-full max-w-[240px] mx-auto border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-pink-500/50 hover:bg-pink-500/5 transition-all group"
          >
            <ImageIcon className="w-8 h-8 text-gray-500 mb-2 group-hover:text-pink-500 transition-colors" />
            <p className="text-sm text-gray-400 group-hover:text-pink-400 transition-colors">
              Chọn ảnh
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
