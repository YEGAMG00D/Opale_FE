// src/services/normalizeCheckNicknameResponse.js

/**
 * 닉네임 중복 확인 응답 데이터 정제
 * @param {Object} data - API 응답 데이터
 * @returns {Object} 정제된 데이터
 */
export const normalizeCheckNicknameResponse = (data) => {
  if (!data) {
    return {
      nickname: '',
      available: false,
    };
  }

  return {
    nickname: data.nickname || '',
    available: data.available ?? false,
  };
};

