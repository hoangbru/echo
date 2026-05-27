"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Headphones,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Music,
  Loader2,
  Crown,
  Calendar,
  RefreshCw,
  ShieldCheck,
  Download,
  Mic2,
} from "lucide-react";

import { SkeletonCard } from "./skeleton-card";

import { SubscriptionStatus } from "@/types";
import { useProfile } from "@/hooks/use-auth";
import { useCancelSubscription } from "@/hooks/use-subscription";
import { formatDate } from "@/lib/utils/format";

const statusLabel: Record<
  SubscriptionStatus,
  { label: string; color: string }
> = {
  active: { label: "Đang hoạt động", color: "text-green-400" },
  cancelling: { label: "Sẽ hết hạn cuối kỳ", color: "text-yellow-400" },
  past_due: { label: "Thanh toán thất bại", color: "text-red-400" },
  inactive: { label: "Không hoạt động", color: "text-muted-foreground" },
};

export function SubscriptionManager() {
  const { data: profile, isLoading } = useProfile();
  const cancelMutation = useCancelSubscription();
  const [confirmCancel, setConfirmCancel] = useState(false);

  const isPro = profile?.isPremium ?? false;
  const isCancelling = profile?.subscriptionStatus === "cancelling";
  const isPastDue = profile?.subscriptionStatus === "past_due";
  const isStripe = !!profile?.stripeSubscriptionId;
  const expiresAt = formatDate(profile?.premiumExpiresAt || "");

  const handleCancelClick = () => {
    if (!confirmCancel) {
      setConfirmCancel(true);
      return;
    }
    cancelMutation.mutate(undefined, {
      onSettled: () => setConfirmCancel(false),
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-10 flex justify-center">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
            Quản lý Gói Đăng ký
            {isPro && (
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full bg-primary/20 border border-primary/40 text-yellow-500`}
              >
                <Crown className="w-3 h-3 fill-current" />
              </span>
            )}
          </h1>
          <p className="text-muted-foreground text-sm">
            Quản lý đặc quyền âm nhạc, thông tin thanh toán và lịch sử giao dịch
            của bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* ── CỘT TRÁI ── */}
          <div className="md:col-span-2 space-y-6">
            {/* Trạng thái gói */}
            {isLoading ? (
              <SkeletonCard />
            ) : (
              <div className="bg-card border border-border rounded-lg p-6 relative overflow-hidden">
                {isPro && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 rounded-bl-lg text-xs font-bold uppercase tracking-wider shadow-sm shadow-ring">
                    Đang kích hoạt
                  </div>
                )}

                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-background border border-border rounded-md shrink-0">
                    <Headphones className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      Echo {isPro ? "Pro" : "Free"}
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1">
                      {isPro
                        ? "Luồng âm thanh chất lương và trải nghiệm không giới hạn."
                        : "Khám phá thế giới âm nhạc với các tính năng cơ bản."}
                    </p>
                    {profile?.subscriptionStatus &&
                      profile.subscriptionStatus !== "inactive" && (
                        <p
                          className={`text-xs mt-1 font-medium ${statusLabel[profile.subscriptionStatus].color}`}
                        >
                          {statusLabel[profile.subscriptionStatus].label}
                        </p>
                      )}
                  </div>
                </div>

                {/* Thông tin thanh toán */}
                {isPro && (
                  <div className="bg-background border border-border rounded-md p-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {isCancelling ? "Hết hạn vào" : "Gia hạn tiếp theo"}
                      </p>
                      <p className="font-semibold text-foreground">
                        {expiresAt}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                        <CreditCard className="w-3 h-3" />
                        Phương thức
                      </p>
                      <p className="font-semibold text-foreground">
                        {isStripe ? "Thẻ quốc tế (Stripe)" : "VNPay / ZaloPay"}
                      </p>
                    </div>

                    {/* past_due warning */}
                    {isPastDue && (
                      <div className="col-span-2 flex items-center gap-2 p-3 rounded-md bg-red-500/10 border border-red-500/30">
                        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                        <p className="text-xs text-red-400">
                          Thanh toán kỳ gần nhất thất bại. Vui lòng cập nhật
                          thông tin thẻ để tránh mất đặc quyền.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Đặc quyền */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-base font-semibold mb-4 border-b border-border pb-3">
                Đặc quyền của bạn
              </h3>
              <ul className="space-y-3">
                {[
                  {
                    icon: ShieldCheck,
                    label: "Chuyển bài không giới hạn",
                  },
                  {
                    icon: Download,
                    label: "Tải xuống và nghe nhạc ngoại tuyến",
                  },
                  {
                    icon: Mic2,
                    label: "Hiển thị lời bài hát thời gian thực nâng cao",
                  },
                  {
                    icon: Zap,
                    label: "Huy hiệu Pro & Tùy chỉnh giao diện độc quyền",
                  },
                ].map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center text-sm">
                    <Icon
                      className={`w-4 h-4 mr-3 shrink-0 ${isPro ? "text-primary" : "text-muted-foreground"}`}
                    />
                    <span
                      className={
                        isPro ? "text-foreground" : "text-muted-foreground"
                      }
                    >
                      {label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── CỘT PHẢI ── */}
          <div className="space-y-6">
            {/* Chọn gói */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-base font-semibold mb-4">Các gói khả dụng</h3>
              <div className="space-y-3">
                {/* Echo Free */}
                <div
                  className={`p-4 rounded-md border transition-all ${
                    !isPro
                      ? "border-primary bg-primary/10"
                      : "border-border bg-background"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Music className="w-4 h-4 text-muted-foreground" />
                    <h4 className="font-semibold text-sm text-foreground">
                      Echo Free
                    </h4>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    0đ / tháng
                  </p>

                  {!isPro ? (
                    <span className="text-xs font-semibold text-primary flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Đang sử dụng
                    </span>
                  ) : isCancelling ? (
                    <span className="text-xs text-yellow-400 flex items-center gap-1">
                      <RefreshCw className="w-3 h-3" /> Sẽ chuyển về Free vào{" "}
                      {expiresAt}
                    </span>
                  ) : (
                    <>
                      {confirmCancel && (
                        <p className="text-xs text-red-400 mb-2">
                          Xác nhận hủy? Nhấn lại để tiếp tục.
                        </p>
                      )}
                      <button
                        onClick={handleCancelClick}
                        disabled={cancelMutation.isPending}
                        className="w-full py-2 rounded-md border border-border text-muted-foreground text-xs font-medium hover:bg-card-hover hover:text-foreground transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                      >
                        {cancelMutation.isPending ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : confirmCancel ? (
                          "Xác nhận hủy gói"
                        ) : (
                          "Trở về gói Free"
                        )}
                      </button>
                    </>
                  )}
                </div>

                {/* Echo Pro */}
                <div
                  className={`p-4 rounded-md border transition-all ${
                    isPro
                      ? "border-primary bg-primary/10"
                      : "border-border bg-background"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Zap
                      className={`w-4 h-4 ${isPro ? "text-primary" : "text-muted-foreground"}`}
                    />
                    <h4 className="font-semibold text-sm text-foreground">
                      Echo Pro
                    </h4>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    39.000đ / tháng
                  </p>

                  {isPro ? (
                    <span className="text-xs font-semibold text-primary flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Đang sử dụng
                    </span>
                  ) : (
                    <Link
                      href="/subscription/payment"
                      className="w-full py-2 rounded-md bg-primary text-primary-foreground text-xs font-bold shadow-sm shadow-ring hover:bg-primary-hover transition-colors flex items-center justify-center gap-1"
                    >
                      <Crown className="w-3 h-3" />
                      Nâng cấp Pro ngay
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Cảnh báo hủy gói */}
            {isPro && !isCancelling && (
              <div className="flex items-start gap-3 p-4 rounded-md bg-sidebar-background border border-border">
                <AlertTriangle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {isStripe
                    ? `Việc hủy sẽ có hiệu lực vào cuối chu kỳ hiện tại. Bạn vẫn giữ đặc quyền đến ngày ${expiresAt}.`
                    : `Gói của bạn sẽ không được gia hạn tự động sau ngày ${expiresAt}.`}
                </p>
              </div>
            )}

            {/* Thông báo đang cancelling */}
            {isCancelling && (
              <div className="flex items-start gap-3 p-4 rounded-md bg-yellow-500/10 border border-yellow-500/30">
                <RefreshCw className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-400 leading-relaxed">
                  Gói Pro của bạn đã được hủy gia hạn. Bạn vẫn có thể sử dụng
                  đặc quyền đến hết ngày <strong>{expiresAt}</strong>.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
