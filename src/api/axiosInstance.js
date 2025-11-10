import axios from "axios";

// ✅ 백엔드 주소 (.env로 관리 가능)
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

// ✅ Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ 요청 인터셉터 (Authorization 헤더 자동 추가)
axiosInstance.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem("accessToken");

    if (token) {
      // ✅ 혹시 공백이 섞여있으면 제거
      token = token.replace(/^Bearer\s+/i, "").trim();
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization; // 토큰 없을 경우 헤더 제거
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ 응답 인터셉터 (401 처리)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("⛔ 인증되지 않은 요청입니다. (401 Unauthorized)");
      // 👉 로그인 만료 시 처리 로직
      // localStorage.removeItem("accessToken");
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
