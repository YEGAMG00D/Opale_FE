// src/services/normalizeSignUpRequest.js

/**
 * 회원가입 요청 데이터 정제
 * formData를 API 요청 형식으로 변환
 * @param {Object} formData - 폼 데이터
 * @returns {Object} API 요청 형식의 데이터
 */
export const normalizeSignUpRequest = (formData) => {
  // 생년월일 변환: YYYYMMdd -> yyyy-MM-dd
  let birth = null;
  if (formData.birthDate && formData.birthDate.length === 8) {
    const year = formData.birthDate.substring(0, 4);
    const month = formData.birthDate.substring(4, 6);
    const day = formData.birthDate.substring(6, 8);
    birth = `${year}-${month}-${day}`;
  }

  // 성별 변환: 'male'/'female' -> '남'/'여'
  let gender = null;
  if (formData.gender === 'male') {
    gender = '남';
  } else if (formData.gender === 'female') {
    gender = '여';
  }

  return {
    email: formData.email || '',
    password: formData.password || '',
    name: formData.name || '',
    birth: birth,
    gender: gender,
    phone: formData.phone || '',
    address1: formData.address || '',
    address2: formData.detailAddress || '',
    nickname: formData.nickname || '',
  };
};

