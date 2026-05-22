import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { toast } from "sonner";

type PaymentProvider = "stripe" | "zalopay" | "vnpay";

export const useCheckoutSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (provider: PaymentProvider) => {
      const res = await apiClient.post("/checkout", { provider });
      return res.data;
    },
    onSuccess(data) {
      const redirectUrl = data.url || data.checkoutUrl;

      if (redirectUrl) {
        window.location.href = redirectUrl;
      }

      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError(error: any) {
      toast.error(error.message);
      console.error("Checkout Error:", error);
    },
  });
};

export const useCancelSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await apiClient.post("/subscription/cancel");
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message ?? "Đã hủy gia hạn thành công.");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.error ?? "Lỗi khi hủy gói. Vui lòng thử lại.",
      );
    },
  });
};
