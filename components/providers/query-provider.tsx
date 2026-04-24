"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // BẮT BUỘC KHỞI TẠO BẰNG useState trong Next.js App Router
  // Để đảm bảo data không bị chia sẻ chéo giữa các user trên Server
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // Dữ liệu sẽ "tươi" trong 1 phút, không gọi lại API nếu user chuyển tab qua lại
            refetchOnWindowFocus: false, // Tắt tự động gọi lại API khi user click lại vào trình duyệt
            retry: 1, // Nếu API lỗi, chỉ thử lại 1 lần
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
