/* ===================================================================
    🎯 User Preference Vector API
    사용자의 개인 취향 임베딩 벡터 관련 API

    ⚠️ 중요
    - 벡터 계산은 백엔드가 함
    - 프론트는 "조회"와 "업데이트 요청"만 수행
=================================================================== */

import axiosInstance from "./axiosInstance";

const base = "/preference";

/* ============================================================
    1) 사용자 선호 벡터 조회
    GET /api/preference
============================================================ */
export const getUserPreferenceVector = async () => {
  try {
    const res = await axiosInstance.get(base);

    if (res.data.success) return res.data.data; // UserPreferenceVectorResponseDto
    throw new Error("사용자 선호 벡터 조회 실패");
  } catch (err) {
    console.error("❌ getUserPreferenceVector 오류:", err);
    throw err;
  }
};

/* ============================================================
    2) 사용자 선호 벡터 생성
    POST /api/preference
    dto = { embeddingVector: "[0.1, 0.2, ...]" }
============================================================ */
export const createUserPreferenceVector = async (dto) => {
  try {
    const res = await axiosInstance.post(base, dto);

    if (res.data.success) return res.data.data;
    throw new Error("사용자 선호 벡터 생성 실패");
  } catch (err) {
    console.error("❌ createUserPreferenceVector 오류:", err);
    throw err;
  }
};

/* ============================================================
    3) 사용자 선호 벡터 업데이트
    PUT /api/preference
============================================================ */
export const updateUserPreferenceVector = async (dto) => {
  try {
    const res = await axiosInstance.put(base, dto);

    if (res.data.success) return res.data.data;
    throw new Error("사용자 선호 벡터 업데이트 실패");
  } catch (err) {
    console.error("❌ updateUserPreferenceVector 오류:", err);
    throw err;
  }
};

/* ============================================================
    Export 객체
============================================================ */
const preferenceApi = {
  getUserPreferenceVector,
  createUserPreferenceVector,
  updateUserPreferenceVector,
};

export default preferenceApi;
