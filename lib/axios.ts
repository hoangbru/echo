import axios from "axios";

// Khởi tạo instance với cấu hình mặc định
export const apiClient = axios.create({
  baseURL: "/api", // Vì gọi API nội bộ Next.js nên chỉ cần /api
  timeout: 10000, // Timeout sau 10s nếu mạng lag
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: Xử lý TRƯỚC KHI request được gửi đi (Tùy chọn)
apiClient.interceptors.request.use(
  (config) => {
    // Nếu bạn cần nhét thêm Token vào header, làm ở đây
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor: Xử lý SAU KHI nhận response từ Server
apiClient.interceptors.response.use(
  (response) => {
    // Tự động bóc tách data, không cần phải gọi res.data.data ở ngoài nữa
    return response.data;
  },
  (error) => {
    // Xử lý lỗi global (Ví dụ: 401 thì tự động văng ra trang login)
    if (error.response?.status === 401) {
      window.location.href = "/auth/login";
    }

    // Ném lỗi ra kèm theo message từ API trả về (nếu có)
    const errorMessage = error.response?.data?.error || error.message;
    return Promise.reject(new Error(errorMessage));
  },
);
