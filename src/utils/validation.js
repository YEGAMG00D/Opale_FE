/**
 * 회원가입 폼 유효성 검사 함수들
 */

/**
 * 이메일 형식 검증
 * @param {string} email - 검증할 이메일
 * @returns {object} { isValid: boolean, message: string }
 */
export const validateEmail = (email) => {
  if (!email) {
    return { isValid: null, message: '' }; // 초기 상태
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(email)) {
    return { isValid: true, message: '올바른 이메일 형식입니다.' };
  } else {
    return { isValid: false, message: '올바른 이메일 형식을 입력해주세요.' };
  }
};

/**
 * 인증번호 검증 (6자리 숫자)
 * @param {string} code - 검증할 인증번호
 * @returns {object} { isValid: boolean, message: string }
 */
export const validateVerificationCode = (code) => {
  if (!code) {
    return { isValid: null, message: '' }; // 초기 상태
  }

  const codeRegex = /^\d{6}$/;
  if (codeRegex.test(code)) {
    return { isValid: true, message: '인증번호 형식이 올바릅니다.' };
  } else {
    return { isValid: false, message: '인증번호는 6자리 숫자여야 합니다.' };
  }
};

/**
 * 비밀번호 검증 (영문, 숫자, 특수문자 포함 8자 이상)
 * @param {string} password - 검증할 비밀번호
 * @returns {object} { isValid: boolean, message: string }
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: null, message: '' }; // 초기 상태
  }

  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasMinLength = password.length >= 8;

  if (!hasMinLength) {
    return { isValid: false, message: '비밀번호는 8자 이상이어야 합니다.' };
  }
  if (!hasLetter) {
    return { isValid: false, message: '영문자를 포함해주세요.' };
  }
  if (!hasNumber) {
    return { isValid: false, message: '숫자를 포함해주세요.' };
  }
  if (!hasSpecial) {
    return { isValid: false, message: '특수문자를 포함해주세요.' };
  }

  return { isValid: true, message: '사용 가능한 비밀번호입니다.' };
};

/**
 * 비밀번호 확인 검증
 * @param {string} password - 원본 비밀번호
 * @param {string} confirmPassword - 확인 비밀번호
 * @returns {object} { isValid: boolean, message: string }
 */
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return { isValid: null, message: '' }; // 초기 상태
  }

  if (password === confirmPassword) {
    return { isValid: true, message: '비밀번호가 일치합니다.' };
  } else {
    return { isValid: false, message: '비밀번호가 일치하지 않습니다.' };
  }
};

/**
 * 닉네임 검증 (2자 이상 10자 이하)
 * @param {string} nickname - 검증할 닉네임
 * @returns {object} { isValid: boolean, message: string }
 */
export const validateNickname = (nickname) => {
  if (!nickname) {
    return { isValid: null, message: '' }; // 초기 상태
  }

  if (nickname.length < 2) {
    return { isValid: false, message: '닉네임은 2자 이상이어야 합니다.' };
  }
  if (nickname.length > 10) {
    return { isValid: false, message: '닉네임은 10자 이하여야 합니다.' };
  }

  return { isValid: true, message: '사용 가능한 닉네임 형식입니다.' };
};

/**
 * 성명 검증 (비어있지 않아야 함)
 * @param {string} name - 검증할 성명
 * @returns {object} { isValid: boolean, message: string }
 */
export const validateName = (name) => {
  if (!name) {
    return { isValid: null, message: '' }; // 초기 상태
  }

  if (name.trim().length === 0) {
    return { isValid: false, message: '성명을 입력해주세요.' };
  }

  return { isValid: true, message: '올바른 성명입니다.' };
};

/**
 * 생년월일 검증 (YYYYMMdd 형식, 8자리 숫자)
 * @param {string} birthDate - 검증할 생년월일
 * @returns {object} { isValid: boolean, message: string }
 */
export const validateBirthDate = (birthDate) => {
  if (!birthDate) {
    return { isValid: null, message: '' }; // 초기 상태
  }

  const dateRegex = /^\d{8}$/;
  if (!dateRegex.test(birthDate)) {
    return { isValid: false, message: '생년월일은 YYYYMMdd 형식(8자리 숫자)으로 입력해주세요.' };
  }

  // 날짜 유효성 검사
  const year = parseInt(birthDate.substring(0, 4));
  const month = parseInt(birthDate.substring(4, 6));
  const day = parseInt(birthDate.substring(6, 8));

  if (month < 1 || month > 12) {
    return { isValid: false, message: '올바른 월을 입력해주세요.' };
  }
  if (day < 1 || day > 31) {
    return { isValid: false, message: '올바른 일을 입력해주세요.' };
  }

  // 간단한 날짜 유효성 검사 (더 정확한 검사는 Date 객체 사용)
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return { isValid: false, message: '올바른 날짜를 입력해주세요.' };
  }

  return { isValid: true, message: '올바른 생년월일 형식입니다.' };
};

/**
 * 연락처 검증 (숫자 11자리, 010으로 시작)
 * @param {string} phone - 검증할 연락처
 * @returns {object} { isValid: boolean, message: string }
 */
export const validatePhone = (phone) => {
  if (!phone) {
    return { isValid: null, message: '' }; // 초기 상태
  }

  const phoneRegex = /^010\d{8}$/;
  if (phoneRegex.test(phone)) {
    return { isValid: true, message: '올바른 연락처 형식입니다.' };
  } else {
    return { isValid: false, message: '연락처는 010으로 시작하는 11자리 숫자여야 합니다.' };
  }
};

/**
 * 주소 검증 (비어있지 않아야 함)
 * @param {string} address - 검증할 주소
 * @returns {object} { isValid: boolean, message: string }
 */
export const validateAddress = (address) => {
  if (!address) {
    return { isValid: null, message: '' }; // 초기 상태
  }

  if (address.trim().length === 0) {
    return { isValid: false, message: '주소를 입력해주세요.' };
  }

  return { isValid: true, message: '올바른 주소입니다.' };
};

/**
 * 상세주소 검증 (비어있지 않아야 함)
 * @param {string} detailAddress - 검증할 상세주소
 * @returns {object} { isValid: boolean, message: string }
 */
export const validateDetailAddress = (detailAddress) => {
  if (!detailAddress) {
    return { isValid: null, message: '' }; // 초기 상태
  }

  if (detailAddress.trim().length === 0) {
    return { isValid: false, message: '상세주소를 입력해주세요.' };
  }

  return { isValid: true, message: '올바른 상세주소입니다.' };
};

/**
 * 보호자 이름 검증 (비어있지 않아야 함)
 * @param {string} guardianName - 검증할 보호자 이름
 * @returns {object} { isValid: boolean, message: string }
 */
export const validateGuardianName = (guardianName) => {
  if (!guardianName) {
    return { isValid: null, message: '' }; // 초기 상태
  }

  if (guardianName.trim().length === 0) {
    return { isValid: false, message: '보호자 이름을 입력해주세요.' };
  }

  return { isValid: true, message: '올바른 보호자 이름입니다.' };
};

