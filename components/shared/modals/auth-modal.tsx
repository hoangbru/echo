"use client";

import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { usePlayer } from "@/hooks/use-player";
import Link from "next/link";

export function AuthModal() {
  const { showLoginModal, setShowLoginModal, teasingTrack, setTeasingTrack } =
    usePlayer();

  const handleOpenChange = (open: boolean) => {
    setShowLoginModal(open);
    if (!open) setTeasingTrack(null);
  };

  return (
    <Dialog open={showLoginModal} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-md p-0 overflow-hidden shadow-2xl rounded-[0.5rem]">
        <div className="relative w-full h-56 bg-sidebar-background flex items-center justify-center p-6 border-b border-border">
          {teasingTrack?.imageUrl ? (
            <div className="relative w-36 h-36 rounded-md overflow-hidden shadow-2xl ring-1 ring-white/10">
              <Image
                src={teasingTrack.imageUrl}
                alt={teasingTrack.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 144px"
              />
            </div>
          ) : (
            <div className="w-36 h-36 bg-primary/20 rounded-md flex items-center justify-center shadow-lg">
              <span className="text-primary font-bold text-5xl">E</span>
            </div>
          )}
        </div>

        <div className="p-6 pt-5 flex flex-col gap-4 text-center">
          <DialogHeader>
            <DialogTitle className="text-foreground text-2xl font-bold text-center tracking-tight">
              Bắt đầu nghe với tài khoản Echo
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-center pt-2 text-sm">
              {teasingTrack ? (
                <>
                  Đăng nhập để phát trọn vẹn bài hát{" "}
                  <strong className="text-foreground">
                    {teasingTrack.title}
                  </strong>{" "}
                  của{" "}
                  <strong className="text-foreground">
                    {teasingTrack.artistNames}
                  </strong>{" "}
                  và tự do sáng tạo không gian âm nhạc của riêng bạn.
                </>
              ) : (
                "Đăng nhập ngay để khám phá hàng triệu bài hát, podcast và tạo playlist không giới hạn."
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 mt-4">
            <Button
              asChild
              className="bg-primary hover:bg-secondary text-primary-foreground font-bold rounded-full py-6 text-[15px] transition-all"
            >
              <Link href="/auth/login">Đăng ký miễn phí</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-border text-foreground hover:bg-white/5 font-bold rounded-full py-6 text-[15px] transition-all"
            >
              <Link href="/auth/login">Đăng nhập</Link>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            Bằng việc tiếp tục, bạn đồng ý với{" "}
            <a href="/terms" className="text-foreground hover:underline">
              Điều khoản dịch vụ
            </a>{" "}
            của Echo.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
