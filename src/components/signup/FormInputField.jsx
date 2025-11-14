import React from 'react';
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
}) => {
  return (
    <div className={styles.inputGroup}>
      <label className={styles.label}>
        {label} {required && <span className={styles.required}>*</span>}
      </label>
      <input
        type={type}
        name={name}
        className={styles.input}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
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

