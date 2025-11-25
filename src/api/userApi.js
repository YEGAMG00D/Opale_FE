/* ============================================================
    👤 User API (회원 관련 전체)
    - 이메일 중복 확인
    - 닉네임 중복 확인
    - 회원가입
    - 내 정보 조회/수정
    - 비밀번호 변경
    - 회원 탈퇴
============================================================ */

import axiosInstance from "./axiosInstance";
import { normalizePasswordResetRequest } from "../services/normalizePasswordResetRequest";
import { normalizePasswordResetResponse } from "../services/normalizePasswordResetResponse";

const base = "/users";

/* ============================================================
    1) 이메일 중복 확인
    POST /api/users/check-duplicate
============================================================ */
export const checkEmailDuplicate = async (email) => {
  try {
    const res = await axiosInstance.post(`${base}/check-duplicate`, { email });

    if (res.data.success) return res.data.message; 
    throw new Error("이메일 중복 확인 실패");
  } catch (err) {
    console.error("❌ checkEmailDuplicate 오류:", err);
    throw err;
  }
};

/* ============================================================
    2) 닉네임 중복 확인
    POST /api/users/check-nickname
============================================================ */
export const checkNicknameDuplicate = async (nickname) => {
  try {
    const res = await axiosInstance.post(`${base}/check-nickname`, { nickname });

    if (res.data.success) return res.data.data; // { nickname, available }
    throw new Error("닉네임 중복 확인 실패");
  } catch (err) {
    console.error("❌ checkNicknameDuplicate 오류:", err);
    throw err;
  }
};

/* ============================================================
    3) 회원가입
    POST /api/users
============================================================ */
export const signUp = async (dto) => {
  try {
    const res = await axiosInstance.post(base, dto);

    if (res.data.success) return res.data.data; 
    throw new Error("회원가입 실패");
  } catch (err) {
    console.error("❌ signUp 오류:", err);
    throw err;
  }
};

/* ============================================================
    4) 내 정보 조회
    GET /api/users/me   (로그인 필요)
============================================================ */
export const fetchMyInfo = async () => {
  try {
    const res = await axiosInstance.get(`${base}/me`);

    if (res.data.success) return res.data.data;
    throw new Error("내 정보 조회 실패");
  } catch (err) {
    console.error("❌ fetchMyInfo 오류:", err);
    throw err;
  }
};

/* ============================================================
    5) 내 정보 수정
    PUT /api/users/me
============================================================ */
export const updateMyInfo = async (dto) => {
  try {
    const res = await axiosInstance.put(`${base}/me`, dto);

    if (res.data.success) return res.data.data;
    throw new Error("내 정보 수정 실패");
  } catch (err) {
    console.error("❌ updateMyInfo 오류:", err);
    throw err;
  }
};

/* ============================================================
    6) 비밀번호 변경
    PATCH /api/users/me/password
============================================================ */
export const changePassword = async (dto) => {
  try {
    const res = await axiosInstance.patch(`${base}/me/password`, dto);

    if (res.data.success) return true;
    throw new Error("비밀번호 변경 실패");
  } catch (err) {
    console.error("❌ changePassword 오류:", err);
    throw err;
  }
};

/* ============================================================
    7) 회원 탈퇴 (Soft Delete)
    PATCH /api/users/me
============================================================ */
export const deleteUser = async (dto) => {
  try {
    const res = await axiosInstance.patch(`${base}/me`, dto || {});

    if (res.data.success) return true;
    throw new Error("회원 탈퇴 실패");
  } catch (err) {
    console.error("❌ deleteUser 오류:", err);
    throw err;
  }
};

/* ============================================================
    8) 임시 비밀번호 발급
    POST /api/users/password/reset
============================================================ */
export const resetPassword = async (email) => {
  try {
    const requestData = normalizePasswordResetRequest(email);
    const res = await axiosInstance.post(`${base}/password/reset`, requestData);

    if (res.data.success) {
      return normalizePasswordResetResponse(res.data.data);
    }
    throw new Error("임시 비밀번호 발급 실패");
  } catch (err) {
    console.error("❌ resetPassword 오류:", err);
    throw err;
  }
};






/* ============================================================
    Export 묶음
============================================================ */
export default {
  checkEmailDuplicate,
  checkNicknameDuplicate,
  signUp,
  fetchMyInfo,
  updateMyInfo,
  changePassword,
  deleteUser,
  resetPassword, 
};
