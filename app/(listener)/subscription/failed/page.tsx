import Link from "next/link";
import { XCircle, RefreshCcw, Headphones } from "lucide-react";

export default function PaymentFailedPage() {
  return (
  <div className="min-h-screen bg-background pb-32 text-foreground flex items-center justify-center">
        <div className="bg-card border border-border rounded-lg p-10 max-w-md w-full text-center">
          <div className="flex justify-center mb-6">
            <XCircle className="w-20 h-20 text-muted-foreground" />
          </div>
  
          <h1 className="text-3xl font-bold mb-4">Nhịp điệu bị gián đoạn</h1>
  
          <p className="text-muted-foreground mb-8 text-sm">
            Giao dịch thanh toán của bạn chưa thành công. Đừng lo lắng, tài khoản
            của bạn chưa bị trừ tiền. Hãy kiểm tra lại thông tin thẻ hoặc thử một
            phương thức khác nhé.
          </p>
  
          <div className="flex flex-col space-y-4">
            <Link
              href="/subscription"
              className="flex items-center justify-center w-full py-3 rounded-md bg-primary text-primary-foreground font-bold hover:bg-primary-hover transition-colors shadow-sm shadow-ring"
            >
              <RefreshCcw className="w-5 h-5 mr-2" />
              Thử thanh toán lại
            </Link>
  
            <Link
              href="/"
              className="flex items-center justify-center w-full py-3 rounded-md border border-border text-foreground font-medium hover:bg-border/50 transition-colors"
            >
              <Headphones className="w-5 h-5 mr-2" />
              Quay về khám phá nhạc
            </Link>
          </div>
        </div>
      </div>);
}
