import Link from "next/link";
import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#09090b] p-4 text-center">
      <div className="max-w-md space-y-6">
        <div className="flex justify-center">
          <AlertCircle className="h-16 w-16 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-zinc-50">Lỗi xác thực</h1>
        <p className="text-zinc-400">
          Đã có lỗi xảy ra trong quá trình đăng nhập. Hệ thống không thể khởi
          tạo tài khoản của bạn lúc này.
        </p>
        <Link href="/auth/login" className="block mt-8">
          <Button
            variant="outline"
            className="w-full border-zinc-800 bg-zinc-900 text-zinc-100"
          >
            Quay lại trang đăng nhập
          </Button>
        </Link>
      </div>
    </div>
  );
}
