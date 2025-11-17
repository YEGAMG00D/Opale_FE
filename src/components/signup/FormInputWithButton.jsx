import React from 'react';
import styles from '../../pages/user/auth/SignupPage.module.css';

/**
 * 입력 필드 + 버튼 컴포넌트
 * @param {string} label - 라벨 텍스트
 * @param {boolean} required - 필수 여부
 * @param {string} name - input name 속성
 * @param {string} type - input type (text, email 등)
 * @param {string} placeholder - placeholder 텍스트
 * @param {string} value - input value
 * @param {function} onChange - onChange 핸들러
 * @param {string} buttonText - 버튼 텍스트
 * @param {function} onButtonClick - 버튼 클릭 핸들러
 * @param {object} validation - 유효성 검사 결과 { isValid: boolean|null, message: string }
 * @param {boolean} disabled - 비활성화 여부
 * @param {boolean} hidden - 숨김 여부 (공간은 차지)
 */
const FormInputWithButton = ({
  label,
  required = false,
  name,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  buttonText,
  onButtonClick,
  validation = { isValid: null, message: '' },
  disabled = false,
  hidden = false,
}) => {
  return (
    <div className={`${styles.inputGroup} ${hidden ? styles.hidden : ''}`}>
      <label className={styles.label}>
        {label} {required && <span className={styles.required}>*</span>}
      </label>
      <div className={styles.inputWithButton}>
        <input
          type={type}
          name={name}
          className={styles.input}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
        <button
          type="button"
          className={styles.smallButton}
          onClick={onButtonClick}
          disabled={disabled}
        >
          {buttonText}
        </button>
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

export default FormInputWithButton;

