// lib/apiClient.ts
import axios from "axios";
import * as dotenv from "dotenv";
import { useAuthStore } from "~~/store/useAuthStore";

dotenv.config();

const apiClient = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_API_URL || "http://207.148.8.209:3000",
  baseURL: "/api",
  timeout: 60000,
});

// 添加请求拦截器：每次请求自动添加 token
apiClient.interceptors.request.use(
  config => {
    // 从 zustand 获取 token
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => Promise.reject(error),
);

export default apiClient;
