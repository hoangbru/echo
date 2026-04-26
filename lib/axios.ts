import axios from "axios";

export const apiClient = axios.create({
  baseURL: "/api",
  timeout: 60000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    // Nếu bạn cần nhét thêm Token vào header, làm ở đây
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/auth/login";
    }

    const errorMessage = error.response?.data?.error || error.message;
    return Promise.reject(new Error(errorMessage));
  },
);
