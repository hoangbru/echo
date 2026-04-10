"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Mic2, Send, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BecomeArtistPage() {
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"IDLE" | "PENDING" | "APPROVED">("IDLE");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkStatus = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("ArtistProfile")
        .select("id")
        .eq("userId", user.id)
        .single();

      if (profile) {
        setStatus("APPROVED");
        return;
      }

      const { data: request } = await supabase
        .from("ArtistRequest")
        .select("status")
        .eq("userId", user.id)
        .order("createdAt", { ascending: false })
        .limit(1)
        .single();

      if (request && request.status === "PENDING") {
        setStatus("PENDING");
      }
    };

    checkStatus();
  }, [supabase]);

  const handleSubmitRequest = async () => {
    if (!reason.trim()) {
      setError("Vui lòng nhập lý do hoặc link nhạc demo của bạn.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth/login");
      return;
    }

    const { error: insertError } = await supabase.from("ArtistRequest").insert({
      userId: user.id,
      reason: reason,
    });

    if (insertError) {
      console.error(insertError);
      setError("Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại!");
    } else {
      setStatus("PENDING");
    }

    setIsLoading(false);
  };

  if (status === "APPROVED") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">
          Bạn đã là Nghệ sĩ!
        </h1>
        <p className="text-neutral-400 mb-6">
          Hồ sơ nghệ sĩ của bạn đã được kích hoạt.
        </p>
        <Button
          onClick={() => router.push("/profile")}
          className="bg-pink-500 hover:bg-pink-600 text-white rounded-md px-6"
        >
          Về trang cá nhân
        </Button>
      </div>
    );
  }

  if (status === "PENDING") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <Clock className="w-16 h-16 text-yellow-500 mb-4 animate-pulse" />
        <h1 className="text-3xl font-bold text-white mb-2">
          Yêu cầu đang được xử lý
        </h1>
        <p className="text-neutral-400 max-w-md mb-6">
          Đơn đăng ký của bạn đã được gửi đến ban quản trị Echo. Quá trình kiểm
          duyệt thường mất từ 1-3 ngày làm việc.
        </p>
        <Button
          variant="outline"
          onClick={() => router.push("/")}
          className="rounded-md px-6"
        >
          Quay lại trang chủ
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
      <div className="text-center mb-12 mt-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-500/10 mb-6 border border-pink-500/20">
          <Mic2 className="w-8 h-8 text-pink-500" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Đăng ký Cấp quyền Nghệ sĩ
        </h1>
        <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
          Hãy để lại link Soundcloud, YouTube hoặc mô tả về thể loại nhạc của
          bạn để chúng tôi có thể xác minh nhanh chóng.
        </p>
      </div>

      <div className="bg-[#18181b] border border-white/10 rounded-xl p-8 max-w-2xl mx-auto">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-md text-red-500 text-sm mb-6">
            {error}
          </div>
        )}

        <div className="space-y-4 mb-6">
          <label className="block text-sm font-medium text-neutral-300">
            Giới thiệu bản thân & Link nhạc Demo{" "}
            <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={5}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Ví dụ: Xin chào, tôi là một nhà sản xuất nhạc EDM. Đây là kênh YouTube của tôi: https://youtube.com/..."
            className="w-full bg-[#09090b] border border-white/10 rounded-md p-4 text-white placeholder:text-neutral-600 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 resize-none transition-all"
          />
        </div>

        <Button
          onClick={handleSubmitRequest}
          disabled={isLoading}
          className="w-full h-12 text-base font-bold bg-pink-500 hover:bg-pink-600 text-white rounded-md shadow-[0_0_15px_rgba(236,72,153,0.3)] transition-all"
        >
          {isLoading ? (
            "Đang gửi đơn..."
          ) : (
            <span className="flex items-center gap-2">
              Gửi Đơn Yêu Cầu <Send className="w-4 h-4" />
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
