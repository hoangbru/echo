"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Upload, Save, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { useArtistDetail, useUpdateArtist } from "@/hooks/use-artists";
import { useAuth } from "@/hooks/use-auth";

export function ArtistSettingsForm() {
  const { user } = useAuth();

  const { data: artistProfile, isLoading: isLoadingArtistProfile } =
    useArtistDetail(user?.id as string, "userId");

  const { mutateAsync: updateArtist, isPending: isUpdating } = useUpdateArtist(
    artistProfile?.id as string,
  );

  const [formData, setFormData] = useState({
    stage_name: "",
    bio: "",
    contact_email: "",
  });

  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const [previewProfile, setPreviewProfile] = useState<string | null>(null);
  const [previewBanner, setPreviewBanner] = useState<string | null>(null);

  useEffect(() => {
    if (artistProfile) {
      setFormData({
        stage_name: artistProfile.stageName || "",
        bio: artistProfile.bio || "",
        contact_email: artistProfile.contactEmail || "",
      });
      setPreviewProfile(artistProfile.profileImage);
      setPreviewBanner(artistProfile.bannerImage);
    }
  }, [artistProfile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "profile" | "banner",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);

    if (type === "profile") {
      setProfileFile(file);
      setPreviewProfile(objectUrl);
    } else {
      setBannerFile(file);
      setPreviewBanner(objectUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const submitData = new FormData();
      submitData.append("stageName", formData.stage_name);
      submitData.append("bio", formData.bio);
      submitData.append("contactEmail", formData.contact_email);

      if (profileFile) submitData.append("profileImage", profileFile);
      if (bannerFile) submitData.append("bannerImage", bannerFile);

      await updateArtist(submitData);

      toast.success("Cập nhật hồ sơ thành công!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Đã có lỗi xảy ra khi lưu thông tin.";
      toast.error(errorMessage);
    }
  };

  if (isLoadingArtistProfile) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!artistProfile) {
    return (
      <div className="text-muted-foreground p-8 bg-card rounded-xl border border-border text-center">
        Không tìm thấy hồ sơ nghệ sĩ. Vui lòng liên hệ quản trị viên.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 max-w-4xl animate-in fade-in duration-300"
    >
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        {/* Banner Image */}
        <div className="relative h-48 md:h-64 w-full bg-muted group cursor-pointer">
          {previewBanner ? (
            <Image
              src={previewBanner}
              alt="Banner"
              fill
              className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
              <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
              <span className="text-[14px]">Tải lên ảnh bìa (Tỷ lệ 16:9)</span>
            </div>
          )}

          <label className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
            <span className="flex items-center gap-2 rounded-full bg-secondary text-secondary-foreground px-4 py-2 text-sm font-medium hover:bg-secondary/80">
              <Upload className="w-4 h-4" /> Thay đổi ảnh bìa
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e, "banner")}
            />
          </label>
        </div>

        {/* Profile Image */}
        <div className="px-6 pb-6 relative">
          <div className="relative -mt-16 mb-4 w-32 h-32 rounded-full border-4 border-card bg-sidebar overflow-hidden group cursor-pointer shadow-lg">
            {previewProfile ? (
              <Image
                src={previewProfile}
                alt="Avatar"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-bold bg-muted text-muted-foreground uppercase">
                {formData.stage_name?.charAt(0) || "A"}
              </div>
            )}

            <label className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
              <Upload className="w-6 h-6 text-foreground" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e, "profile")}
              />
            </label>
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold text-foreground">
              Hình ảnh nghệ sĩ
            </h3>
            <p className="text-[14px] text-muted-foreground">
              Ảnh đại diện sẽ xuất hiện trên thanh tìm kiếm và trang chi tiết
              nghệ sĩ. Nhấn vào ảnh để thay đổi.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
        <h3 className="text-[18px] font-semibold text-foreground border-b border-border pb-4">
          Thông tin cơ bản
        </h3>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-[14px] font-medium text-foreground">
              Nghệ danh (Stage Name)
            </label>
            <input
              name="stage_name"
              value={formData.stage_name}
              onChange={handleChange}
              placeholder="VD: GREY D"
              className="w-full bg-input border border-border rounded-md px-4 py-2.5 text-[14px] text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[14px] font-medium text-foreground">
              Email liên hệ (Booking/Contact)
            </label>
            <input
              name="contact_email"
              type="email"
              value={formData.contact_email}
              onChange={handleChange}
              placeholder="booking@artist.com"
              className="w-full bg-input border border-border rounded-md px-4 py-2.5 text-[14px] text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[14px] font-medium text-foreground">
            Tiểu sử (Bio)
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Chia sẻ câu chuyện âm nhạc của bạn với người hâm mộ..."
            rows={5}
            className="w-full bg-input border border-border rounded-md px-4 py-2.5 text-[14px] text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-none"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isUpdating}
          className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8 rounded-full transition-colors"
        >
          {isUpdating ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Lưu thay đổi
        </Button>
      </div>
    </form>
  );
}
