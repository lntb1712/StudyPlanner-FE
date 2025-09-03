import axios from "axios";

export const http = axios.create({
  baseURL: "https://studyplannerapi.onrender.com/api", // <-- bạn có thể đổi thành import.meta.env.VITE_API_URL
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Interceptor response: luôn trả về response.data, nếu lỗi thì trả về Error(message)
http.interceptors.response.use(
  (response) => {
    return response.data; // luôn lấy data
  },
  (error) => {
    const msg =
      error?.response?.data?.Message ||
      error?.response?.data?.message ||
      error.message ||
      "NETWORK_ERROR";
    return Promise.reject(new Error(msg));
  }
);
