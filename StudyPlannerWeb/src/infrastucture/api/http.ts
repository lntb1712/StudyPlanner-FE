import axios from "axios";

export const http = axios.create({
  baseURL: "https://651c037c29cb.ngrok-free.app/api", // <-- đổi từ import.meta.env
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// interceptor request
http.interceptors.response.use(
  (response: any) => response, // trả về toàn bộ response
  (error: any) => Promise.reject(error)
);


// interceptor response
http.interceptors.response.use(
  (response: any) => response.data,
  (error: any) => {
    const msg =
      error?.response?.data?.Message ||
      error?.response?.data?.message ||
      error.message ||
      "NETWORK_ERROR";
    return Promise.reject(new Error(msg));
  }
);
