import Link from "next/link";
import { ShieldAlert, Home, ArrowLeft } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-4 text-center">
      <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(239,68,68,0.2)]">
        <ShieldAlert className="w-12 h-12 text-red-500" />
      </div>

      <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500 mb-4 tracking-tighter">
        403
      </h1>

      <p className="text-gray-400 max-w-md mb-10 leading-relaxed text-lg">
        Xin lỗi, tài khoản của bạn không có đủ quyền hạn để vào khu vực Quản trị
        viên. Nếu bạn cho rằng đây là một sự nhầm lẫn, vui lòng liên hệ với
        chúng tôi.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white font-medium transition-all hover:-translate-y-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Link>

        <Link
          href="/"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-pink-500 hover:bg-pink-600 shadow-[0_0_20px_rgba(236,72,153,0.3)] rounded-full text-white font-medium transition-all hover:-translate-y-1"
        >
          <Home className="w-4 h-4" />
          Trang chủ Echo
        </Link>
      </div>
    </div>
  );
}
