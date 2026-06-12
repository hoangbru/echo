"use client";

import { Crown } from "lucide-react";
import Link from "next/link";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";

export function UpgradeModal() {
  const { isOpen, onClose, data } = useUpgradeModal();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-popover border-border sm:max-w-[400px] p-0 overflow-hidden shadow-2xl">
        <div className="relative h-32 bg-gradient-to-br from-primary/20 via-popover to-secondary/20 flex items-center justify-center border-b border-border">
          <div className="bg-primary/10 p-4 rounded-full border border-primary/20 shadow-[0_0_30px_rgba(var(--primary),0.2)]">
            <Crown className="w-10 h-10 text-primary" />
          </div>
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

          <div className="flex flex-col gap-3 mt-2">
            <Button
              asChild
              className="w-full py-6 rounded-xl font-bold text-primary-foreground shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <Link href="/subscription" onClick={onClose}>
                <Crown className="w-4 h-4 mr-2" />
                Nâng cấp ngay
              </Link>
            </Button>
            <Button
              variant="ghost"
              onClick={onClose}
              className="w-full py-6 rounded-xl font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Để sau
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
