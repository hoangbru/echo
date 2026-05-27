"use client";

import { X, Crown } from "lucide-react";
import Link from "next/link";

import { useUpgradeModal } from "@/hooks/use-upgrade-modal";

export function UpgradeModal() {
  const { isOpen, onClose, data } = useUpgradeModal();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-popover border border-border w-full max-w-[400px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 mx-4">
        <div className="relative h-32 bg-gradient-to-br from-primary/20 via-popover to-purple-600/20 flex items-center justify-center border-b border-white/5">
          <div className="bg-primary/10 p-4 rounded-full border border-primary/20 shadow-[0_0_30px_rgba(var(--primary),0.2)]">
            <Crown className="w-10 h-10 text-primary" />
          </div>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 text-center">
          <h3 className="text-xl font-bold text-foreground mb-2">
            {data.title || "Đặc Quyền Premium"}
          </h3>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            {data.description || (
              <span>
                Tính năng này là đặc quyền dành riêng cho thành viên{" "}
                <span className="text-primary font-semibold">Premium</span>.
                Nâng cấp ngay để lột xác trải nghiệm âm nhạc của bạn!
              </span>
            )}
          </p>

          <div className="flex flex-col gap-2">
            <Link
              href="/subscription"
              onClick={onClose}
              className="w-full py-3 rounded-xl font-bold text-primary-foreground bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
            >
              <Crown className="w-4 h-4" />
              Nâng cấp ngay
            </Link>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl font-medium text-muted-foreground bg-transparent hover:bg-secondary transition-colors"
            >
              Để sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
