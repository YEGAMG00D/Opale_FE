import React, { useState } from 'react';
import styles from '../../pages/user/auth/SignupPage.module.css';

/**
 * 기본 입력 필드 컴포넌트
 * @param {string} label - 라벨 텍스트
 * @param {boolean} required - 필수 여부
 * @param {string} name - input name 속성
 * @param {string} type - input type (text, password, tel 등)
 * @param {string} placeholder - placeholder 텍스트
 * @param {string} value - input value
 * @param {function} onChange - onChange 핸들러
 * @param {object} validation - 유효성 검사 결과 { isValid: boolean|null, message: string }
 * @param {boolean} disabled - 비활성화 여부
 * @param {boolean} showPasswordToggle - 비밀번호 표시/숨김 토글 버튼 표시 여부
 */
const FormInputField = ({
  label,
  required = false,
  name,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  validation = { isValid: null, message: '' },
  disabled = false,
  showPasswordToggle = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === 'password';
  const inputType = isPasswordType && showPasswordToggle && showPassword ? 'text' : type;

  return (
    <div className={styles.inputGroup}>
      <label className={styles.label}>
        {label} {required && <span className={styles.required}>*</span>}
      </label>
      <div className={styles.inputWrapper}>
        <input
          type={inputType}
          name={name}
          className={styles.input}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
        {isPasswordType && showPasswordToggle && (
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
          >
            {showPassword ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            )}
          </button>
        )}
      </div>
      <div className={styles.messageContainer}>
        {validation.isValid !== null && validation.message && (
          <p className={validation.isValid ? styles.successMsg : styles.errorMsg}>
            {validation.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default FormInputField;

