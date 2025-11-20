// src/services/normalizeSignUpResponse.js

/**
 * 회원가입 응답 데이터 정제
 * @param {Object} data - API 응답 데이터
 * @returns {Object} 정제된 데이터
 */
export const normalizeSignUpResponse = (data) => {
  if (!data) {
    return {
      userId: null,
      email: '',
      nickname: '',
      name: '',
      birth: null,
      phone: '',
      address1: '',
      address2: '',
      role: '',
      createdAt: null,
    };
  }

  return {
    userId: data.userId || null,
    email: data.email || '',
    nickname: data.nickname || '',
    name: data.name || '',
    birth: data.birth || null,
    phone: data.phone || '',
    address1: data.address1 || '',
    address2: data.address2 || '',
    role: data.role || '',
    createdAt: data.createdAt || null,
  };
};

