// src/services/normalizePasswordResetRequest.js

/**
 * 비밀번호 재발급 요청 데이터 정제
 * @param {string} email - 이메일 주소
 * @returns {Object} API 요청 형식의 데이터
 */
export const normalizePasswordResetRequest = (email) => {
  return {
    email: email || '',
  };
};

