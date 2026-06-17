"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, Home, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ForbiddenPage() {
  const router = useRouter();

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-background px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-destructive/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg space-y-8">
        <div className="relative flex items-center justify-center w-32 h-32 bg-destructive/10 rounded-full shadow-xl shadow-destructive/20">
          <ShieldAlert className="w-16 h-16 text-destructive" />
        </div>

        <div className="space-y-4">
          <h1 className="text-7xl sm:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-foreground to-muted-foreground drop-shadow-sm">
            403
          </h1>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Khu vực cấm truy cập!
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Xin lỗi, tài khoản của bạn không có đủ quyền hạn để vào khu vực
              này. Nếu bạn cho rằng đây là một sự nhầm lẫn, vui lòng liên hệ với
              bộ phận hỗ trợ.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full pt-4">
          <Button
            onClick={() => router.back()}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto gap-2 rounded-full border-border hover:bg-accent hover:text-accent-foreground transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại trang trước
          </Button>

          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto gap-2 rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
          >
            <Link href="/">
              <Home className="w-4 h-4" />
              Trang chủ Echo
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
