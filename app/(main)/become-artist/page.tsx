import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ArtistRegisterForm } from "./artist-register-form";
import { Clock } from "lucide-react";
import { ArtistRequestService, ArtistService } from "@/lib/services";

export default async function BecomeArtistPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/login");
  }

  const existingArtist = await ArtistService.getCurrentArtist(
    supabase,
    user.id,
  );

  if (existingArtist) {
    redirect("/studio/dashboard");
  }

  const pendingRequest = await ArtistRequestService.getPendingRequest(
    supabase,
    user.id,
  );

  if (pendingRequest) {
    return (
      <div className="min-h-screen pt-32 pb-24 px-6 flex flex-col items-center justify-start text-center">
        <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-6">
          <Clock className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">
          Đơn của bạn đang được duyệt
        </h1>
        <p className="text-gray-400 max-w-md mx-auto">
          Cảm ơn bạn đã đăng ký trở thành Nghệ sĩ trên Echo. Đội ngũ quản trị
          viên đang xem xét hồ sơ của bạn. Quá trình này có thể mất từ 1-3 ngày
          làm việc.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-24 px-6">
      <ArtistRegisterForm userId={user.id} />
    </div>
  );
}
