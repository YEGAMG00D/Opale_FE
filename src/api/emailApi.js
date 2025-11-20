// src/api/emailApi.js
import axiosInstance from "./axiosInstance";

const base = "/email";

/* ============================================================
    📩 1. 이메일 인증번호 발송
    POST /api/email/send
    body: { email }
============================================================ */
export const sendEmailCode = async (email) => {
  try {
    const res = await axiosInstance.post(`${base}/send`, { email });

    if (res.data.success) {
      return res.data.data; // { email, message, expiresIn }
    }

    throw new Error("이메일 인증번호 발송 실패");
  } catch (err) {
    console.error("❌ sendEmailCode 오류:", err);
    throw err;
  }
};

/* ============================================================
    📮 2. 이메일 인증번호 검증
    POST /api/email/verify
    body: { email, code }
============================================================ */
export const verifyEmailCode = async ({ email, code }) => {
  try {
    const res = await axiosInstance.post(`${base}/verify`, { email, code });

    if (res.data.success) {
      return res.data.data; // { email, verified, message }
    }

    throw new Error("인증번호 검증 실패");
  } catch (err) {
    console.error("❌ verifyEmailCode 오류:", err);
    throw err;
  }
};

export default {
  sendEmailCode,
  verifyEmailCode,
};
