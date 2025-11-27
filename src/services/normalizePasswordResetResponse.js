// src/services/normalizePasswordResetResponse.js

/**
 * 비밀번호 재발급 응답 데이터 정제
 * @param {Object} data - API 응답 데이터
 * @returns {Object} 정제된 데이터
 */
export const normalizePasswordResetResponse = (data) => {
  if (!data) {
    return {
      email: '',
      success: false,
    };
  }

  return {
    email: data.email || '',
    success: data.success !== undefined ? data.success : false,
  };
};

