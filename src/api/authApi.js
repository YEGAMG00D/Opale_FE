// src/api/authApi.js
import axiosInstance from "./axiosInstance";

const base = "/auth";

/* ============================================================
   ✅ 1. 로그인 요청
============================================================ */
export const login = async (email, password) => {
  const res = await axiosInstance.post(`${base}/login`, {
    email,
    password,
  });
  return res.data;
};

/* ============================================================
   ✅ 2. 로그아웃 요청
============================================================ */
export const logout = async () => {
  const res = await axiosInstance.post(`${base}/logout`);
  return res.data;
};

/* ============================================================
   ✅ 3. 토큰 재발급 (백업용 — axiosInstance에서 자동 처리됨)
============================================================ */
export const refreshToken = async (refreshToken) => {
  const res = await axiosInstance.post(
    `${base}/refresh`,
    {},
    {
      headers: {
        "Refresh-Token": refreshToken,
      },
    }
  );
  return res.data;
};

export default {
  login,
  logout,
  refreshToken,
};
