// src/services/normalizeVerifyCodeResponse.js

/**
 * 이메일 인증번호 검증 응답 데이터 정제
 * @param {Object} data - API 응답 데이터
 * @returns {Object} 정제된 데이터
 */
export const normalizeVerifyCodeResponse = (data) => {
  if (!data) {
    return {
      email: '',
      verified: false,
      message: '',
    };
  }

  return {
    email: data.email || '',
    verified: data.verified ?? false,
    message: data.message || '',
  };
};

