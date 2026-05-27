import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function SubscriptionPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-20 px-6">
      <div className="text-center max-w-2xl mb-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Nâng tầm trải nghiệm âm nhạc của bạn
        </h1>
        <p className="text-muted-foreground text-base">
          Nghe nhạc chất lượng và tải xuống không giới hạn. Hủy
          gói bất kỳ lúc nào.
        </p>
      </div>

      <div className="flex justify-center gap-8 max-w-4xl w-full">
        {/* Gói Echo Pro */}
        <div className="bg-card border-2 border-primary rounded-lg p-8 flex flex-col relative shadow-[0_0_30px_rgba(255,26,140,0.15)] transform md:-translate-y-4">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Khuyên dùng
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Echo Pro</h2>
            <div className="text-3xl font-bold mb-1">
              39.000đ
              <span className="text-base font-normal text-muted-foreground">
                /tháng
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Trải nghiệm âm thanh đỉnh cao, không giới hạn.
            </p>
          </div>

          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-start text-sm">
              <CheckCircle2 className="w-5 h-5 text-primary mr-3 shrink-0" />
              <span>Chuyển bài không giới hạn</span>
            </li>
            <li className="flex items-start text-sm">
              <CheckCircle2 className="w-5 h-5 text-primary mr-3 shrink-0" />
              <span>Tải xuống và nghe nhạc ngoại tuyến</span>
            </li>
            <li className="flex items-start text-sm">
              <CheckCircle2 className="w-5 h-5 text-primary mr-3 shrink-0" />
              <span>Hiển thị lời bài hát thời gian thực nâng cao</span>
            </li>
            <li className="flex items-start text-sm">
              <CheckCircle2 className="w-5 h-5 text-primary mr-3 shrink-0" />
              <span>Huy hiệu Pro & Tùy chỉnh giao diện độc quyền</span>
            </li>
          </ul>

          <Link
            href="/subscription/payment"
            className="w-full py-3 rounded-md bg-primary text-primary-foreground font-bold hover:bg-primary-hover transition-colors shadow-sm shadow-ring flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            Nâng cấp ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
