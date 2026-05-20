"use client";

import { useState } from "react";
import { CreditCard, QrCode, Smartphone, Loader2 } from "lucide-react";

import { useCheckout } from "@/hooks/use-checkout";

export default function PremiumCheckout() {
  const { mutate, isPending } = useCheckout();

  const [paymentMethod, setPaymentMethod] = useState<
    "stripe" | "zalopay" | "vnpay"
  >("vnpay");

  const handlePayment = async () => {
    mutate(paymentMethod);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-20 px-6">
      <div className="max-w-xl w-full bg-card border border-border rounded-lg p-8 shadow-sm">
        <h1 className="text-2xl font-bold mb-2">Thanh toán gói Echo Pro</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Chọn phương thức thanh toán phù hợp với bạn. Hủy gói bất cứ lúc nào.
        </p>

        <div className="space-y-4 mb-8">
          {/* VNPay */}
          <button
            onClick={() => setPaymentMethod("vnpay")}
            className={`w-full flex items-center p-4 rounded-md border transition-all ${
              paymentMethod === "vnpay"
                ? "border-primary bg-primary/10"
                : "border-border hover:bg-card-hover"
            }`}
          >
            <QrCode
              className={`w-6 h-6 mr-4 ${paymentMethod === "vnpay" ? "text-primary" : "text-muted-foreground"}`}
            />
            <div className="text-left">
              <div className="font-semibold text-foreground">
                Thanh toán qua VNPay
              </div>
              <div className="text-xs text-muted-foreground">
                Hỗ trợ QR-Pay, Ngân hàng nội địa
              </div>
            </div>
          </button>

          {/* ZaloPay */}
          <button
            onClick={() => setPaymentMethod("zalopay")}
            className={`w-full flex items-center p-4 rounded-md border transition-all ${
              paymentMethod === "zalopay"
                ? "border-primary bg-primary/10"
                : "border-border hover:bg-card-hover"
            }`}
          >
            <Smartphone
              className={`w-6 h-6 mr-4 ${paymentMethod === "zalopay" ? "text-primary" : "text-muted-foreground"}`}
            />
            <div className="text-left">
              <div className="font-semibold text-foreground">
                Ví điện tử ZaloPay
              </div>
              <div className="text-xs text-muted-foreground">
                Thanh toán tiện lợi qua ví
              </div>
            </div>
          </button>

          {/* Stripe */}
          <button
            onClick={() => setPaymentMethod("stripe")}
            className={`w-full flex items-center p-4 rounded-md border transition-all ${
              paymentMethod === "stripe"
                ? "border-primary bg-primary/10"
                : "border-border hover:bg-card-hover"
            }`}
          >
            <CreditCard
              className={`w-6 h-6 mr-4 ${paymentMethod === "stripe" ? "text-primary" : "text-muted-foreground"}`}
            />
            <div className="text-left">
              <div className="font-semibold text-foreground">
                Thẻ Quốc Tế (Visa/Mastercard)
              </div>
              <div className="text-xs text-muted-foreground">
                Thanh toán bảo mật qua Stripe
              </div>
            </div>
          </button>
        </div>

        <button
          onClick={handlePayment}
          disabled={isPending}
          className="w-full py-3 rounded-md bg-primary text-primary-foreground font-bold hover:bg-primary-hover transition-colors shadow-sm shadow-ring flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Xác nhận thanh toán 39.000đ"
          )}
        </button>
      </div>
    </div>
  );
}
