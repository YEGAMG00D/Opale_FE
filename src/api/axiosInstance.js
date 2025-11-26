// src/api/axiosInstance.js
import axios from "axios";
import store from "../store";
import { reissueToken, logout } from "../store/userSlice";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

// ✅ 요청 인터셉터 (Authorization 헤더 자동 추가)
axiosInstance.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem("accessToken");
    if (token) {
      token = token.replace(/^Bearer\s+/i, "").trim();
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ 응답 인터셉터 (401 → 자동 재발급)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // AccessToken 만료로 401 발생한 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("Refresh token missing");

        // 🔁 토큰 재발급 요청
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { headers: { "Refresh-Token": refreshToken } }
        );

        const { accessToken, refreshToken: newRefresh } =
          refreshResponse.data.data;

        // ✅ 새 토큰 저장
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefresh);
        store.dispatch(reissueToken(accessToken));

        // ✅ 기존 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.warn("❌ 토큰 재발급 실패:", refreshError);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        store.dispatch(logout());
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
