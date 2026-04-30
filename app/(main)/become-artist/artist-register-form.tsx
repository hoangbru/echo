"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { useSubmitArtistRequest } from "@/hooks/use-artist-request";

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
import { Loader2 } from "lucide-react";
import {
  ArtistRequestFormValues,
  artistRequestSchema,
} from "@/lib/validations/artist-request.schema";
import { SuccessModal } from "@/components/modals/success-modal";
import { Checkbox } from "@/components/ui/checkbox";

export function ArtistRegisterForm({ userId }: { userId: string }) {
  const router = useRouter();

  const {
    mutate: submitRequest,
    isPending,
    isSuccess,
  } = useSubmitArtistRequest();

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
      demoLink: "",
      profileImage: "",
      agreedToTerms: false,
    },
  });

  const onSubmit = (values: ArtistRequestFormValues) => {
    submitRequest(values, {
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
          {/* --- CONTACT & DEMO --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <FormField
              control={form.control}
              name="demoLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    Link nghe thử Demo (Bắt buộc){" "}
                    <span className="text-primary">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Link Soundcloud, Youtube, Drive..."
                      className="bg-black/50 border-white/10 text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* --- PROFILE IMAGE --- */}
          <FormField
            control={form.control}
            name="profileImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">
                  Link Ảnh đại diện (Tùy chọn)
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="URL hình ảnh rõ nét của bạn..."
                    className="bg-black/50 border-white/10 text-white"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* --- CHECKBOX CAM KẾT --- */}
          <FormField
            control={form.control}
            name="agreedToTerms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-white/10 bg-white/5 p-4 mt-6">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-white font-medium">
                    Cam kết bản quyền <span className="text-primary">*</span>
                  </FormLabel>
                  <p className="text-sm text-gray-400">
                    Tôi cam kết sở hữu 100% bản quyền hợp pháp đối với các sản
                    phẩm âm nhạc sẽ phát hành trên Echo. Mọi vi phạm sẽ bị khóa
                    tài khoản vĩnh viễn.
                  </p>
                </div>
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
