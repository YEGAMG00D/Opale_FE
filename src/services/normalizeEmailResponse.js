// src/services/normalizeEmailResponse.js

/**
 * 이메일 인증번호 발송 응답 데이터 정제
 * @param {Object} data - API 응답 데이터
 * @returns {Object} 정제된 데이터
 */
export const normalizeEmailResponse = (data) => {
  if (!data) {
    return {
      email: '',
      message: '',
      expiresIn: 300, // 기본값 5분
    };
  }

  return {
    email: data.email || '',
    message: data.message || '인증번호가 발송되었습니다.',
    expiresIn: data.expiresIn || 300, // 초 단위
  };
};

