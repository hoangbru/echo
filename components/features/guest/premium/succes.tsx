import Link from "next/link";
import { CheckCircle2, PlayCircle } from "lucide-react";

export default function PremiumSuccess() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <div className="bg-card border border-border rounded-lg p-10 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="w-20 h-20 text-green-500" />
        </div>

        <h1 className="text-3xl font-bold mb-4">Thanh toán thành công!</h1>

        <p className="text-muted-foreground mb-8 text-sm">
          Chào mừng bạn đến với Echo Pro. Tài khoản của bạn đã được nâng cấp.
          Tận hưởng âm nhạc chất lượng Lossless ngay bây giờ.
        </p>

        <Link
          href="/"
          className="flex items-center justify-center w-full py-3 rounded-md bg-primary text-primary-foreground font-bold hover:bg-primary-hover transition-colors"
        >
          <PlayCircle className="w-5 h-5 mr-2" />
          Bắt đầu nghe nhạc
        </Link>
      </div>
    </div>
  );
}
