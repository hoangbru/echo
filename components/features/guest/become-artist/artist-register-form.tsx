"use client";

import { ChangeEvent, Fragment, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ImageIcon, Loader2, Music, Upload } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SuccessModal } from "@/components/features/modals";
import { Checkbox } from "@/components/ui/checkbox";

import {
  ArtistRequestFormValues,
  artistRequestSchema,
} from "@/lib/validations/artist-request.schema";
import { useSubmitArtistRequest } from "@/hooks/use-artist-request";

export function ArtistRegisterForm() {
  const router = useRouter();

  const {
    mutate: submitRequest,
    isPending,
    isSuccess,
  } = useSubmitArtistRequest();

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const [audioName, setAudioName] = useState<string>("");

  const form = useForm<ArtistRequestFormValues>({
    resolver: zodResolver(artistRequestSchema),
    defaultValues: {
      stageName: "",
      bio: "",
      facebook: "",
      instagram: "",
      youtube: "",
      reviewComment: "",
      reviewedBy: "",
      contactEmail: "",
      agreedToTerms: false,
    },
  });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAudioChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      setAudioName(file.name);
      setAudioPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = (values: ArtistRequestFormValues) => {
    if (!audioFile) {
      toast.error("Vui lòng tải lên bản thu Demo");
      return;
    }
    const formData = new FormData();

    formData.append("demoAudioFile", audioFile);
    if (imageFile) {
      formData.append("profileImageFile", imageFile);
    }

    formData.append("stageName", values.stageName);
    formData.append("bio", values.bio);
    formData.append("contactEmail", values.contactEmail);
    formData.append("agreedToTerms", values.agreedToTerms.toString());

    if (values.facebook) formData.append("facebook", values.facebook);
    if (values.instagram) formData.append("instagram", values.instagram);
    if (values.youtube) formData.append("youtube", values.youtube);

    submitRequest(formData, {
      onSuccess: () => {
        setTimeout(() => router.refresh(), 1500);
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-[#18181b] rounded-2xl border border-white/10 shadow-2xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">
          Trở thành Nghệ sĩ
        </h1>
        <p className="text-gray-400">
          Chia sẻ âm nhạc của bạn với thế giới qua Echo.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* --- STAGE NAME --- */}
          <FormField
            control={form.control}
            name="stageName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">
                  Tên Nghệ Sĩ (Stage Name){" "}
                  <span className="text-primary">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ví dụ: Chi Fairy..."
                    className="bg-black/50 border-white/10 text-white"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* --- BIO --- */}
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">
                  Tiểu sử <span className="text-primary">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Giới thiệu phong cách âm nhạc của bạn..."
                    className="bg-black/50 border-white/10 text-white h-32"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* --- CONTACT --- */}
          <FormField
            control={form.control}
            name="contactEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">
                  Email liên hệ <span className="text-primary">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    className="bg-black/50 border-white/10 text-white"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* --- DEMO --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* --- PROFILE IMAGE --- */}
            <FormItem className="flex flex-col items-center justify-start pt-2">
              <div className="w-full text-left mb-2">
                <FormLabel className="text-white">
                  Ảnh đại diện (Tùy chọn)
                </FormLabel>
              </div>
              <FormControl>
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#262626] bg-[#141414] rounded-full w-40 h-40 hover:border-[#FF1A8C] transition cursor-pointer relative overflow-hidden group">
                  {imagePreview ? (
                    <Fragment>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="absolute inset-0 w-full h-full object-cover rounded-full opacity-80 group-hover:opacity-30 transition-opacity duration-300"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="bg-black/70 text-white hover:bg-black font-medium rounded-full"
                          onClick={(e) => {
                            e.preventDefault();
                            document.getElementById("profile-upload")?.click();
                          }}
                        >
                          Thay đổi
                        </Button>
                      </div>
                    </Fragment>
                  ) : (
                    <div className="text-center space-y-2 pointer-events-none flex flex-col items-center justify-center h-full">
                      <ImageIcon className="w-8 h-8 text-[#B3B3B3]" />
                      <span className="text-xs text-[#B3B3B3]">
                        Nhấn chọn ảnh
                      </span>
                    </div>
                  )}
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
                    onChange={handleImageChange}
                  />
                </div>
              </FormControl>
            </FormItem>

            {/* --- DEMO AUDIO  --- */}
            <FormItem>
              <FormLabel className="text-white">
                Bản thu Demo <span className="text-[#FF1A8C]">*</span>
              </FormLabel>
              <FormControl>
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#262626] bg-[#141414] rounded-xl p-4 hover:border-[#FF1A8C] transition relative overflow-hidden">
                  {audioPreview ? (
                    <div className="w-full space-y-3 z-10 relative">
                      <div className="flex items-center gap-2 text-sm text-[#FF1A8C] font-medium truncate">
                        <Music className="w-4 h-4 shrink-0" />
                        <span className="truncate">{audioName}</span>
                      </div>
                      <audio
                        controls
                        src={audioPreview}
                        className="w-full h-8"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="w-full border-[#262626] text-white hover:text-white hover:bg-[#262626]"
                        onClick={() =>
                          document.getElementById("audio-upload")?.click()
                        }
                      >
                        Đổi file khác
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center space-y-2 pointer-events-none">
                      <Upload className="w-8 h-8 text-[#B3B3B3] mx-auto" />
                      <span className="text-sm text-[#B3B3B3]">
                        Tải lên file mp3, wav, flac
                      </span>
                    </div>
                  )}
                  <input
                    id="audio-upload"
                    type="file"
                    accept="audio/mpeg, audio/wav, audio/flac"
                    className={`absolute inset-0 w-full h-full cursor-pointer ${audioPreview ? "hidden" : "opacity-0"}`}
                    onChange={handleAudioChange}
                  />
                </div>
              </FormControl>
            </FormItem>
          </div>

          {/* --- CHECKBOX CAM KẾT --- */}
          <FormField
            control={form.control}
            name="agreedToTerms"
            render={({ field }) => (
              <FormItem className="mt-6 space-y-3">
                <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-[#262626] bg-[#141414] p-4 transition-colors hover:border-[#FF1A8C]/50">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="mt-0.5 border-[#B3B3B3] data-[state=checked]:bg-[#FF1A8C] data-[state=checked]:border-[#FF1A8C] data-[state=checked]:text-white"
                    />
                  </FormControl>
                  <div className="space-y-1.5 leading-none">
                    <FormLabel className="text-white font-medium cursor-pointer">
                      Cam kết bản quyền <span className="text-primary">*</span>
                    </FormLabel>
                    <p className="text-sm text-[#B3B3B3] leading-snug">
                      Tôi cam kết sở hữu 100% bản quyền hợp pháp đối với các sản
                      phẩm âm nhạc sẽ phát hành trên Echo. Mọi vi phạm sẽ bị
                      khóa tài khoản vĩnh viễn.
                    </p>
                  </div>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* --- SOCIAL LINKS --- */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
              Mạng xã hội (Tùy chọn)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="facebook"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Link Facebook"
                        className="bg-black/50 border-white/10 text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Link Instagram"
                        className="bg-black/50 border-white/10 text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="youtube"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Link Youtube Channel"
                      className="bg-black/50 border-white/10 text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-bold px-6 shadow-[0_0_20px_rgba(236,72,153,0.3)]"
            >
              {isPending ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                "Gửi yêu cầu xác thực"
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
        </form>
      </Form>

      <SuccessModal
        isOpen={isSuccess}
        title="Gửi yêu cầu thành công!"
        description="Chúng tôi sẽ xem xét hồ sơ của bạn và phản hồi sớm nhất"
        onConfirm={() => router.push(`/#`)}
      />
    </div>
  );
}
