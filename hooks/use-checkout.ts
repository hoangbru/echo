import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { toast } from "sonner";

type PaymentProvider = "stripe" | "zalopay" | "vnpay";

export const useCheckout = () => {
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
