import React from 'react';
import styles from '../../pages/user/auth/SignupPage.module.css';

/**
 * 입력 필드 + 버튼 + 타이머 컴포넌트 (인증번호 전용)
 * @param {string} label - 라벨 텍스트
 * @param {boolean} required - 필수 여부
 * @param {string} name - input name 속성
 * @param {string} placeholder - placeholder 텍스트
 * @param {string} value - input value
 * @param {function} onChange - onChange 핸들러
 * @param {string} buttonText - 버튼 텍스트
 * @param {function} onButtonClick - 버튼 클릭 핸들러
 * @param {object} validation - 유효성 검사 결과 { isValid: boolean|null, message: string }
 * @param {number} timer - 타이머 초
 * @param {function} formatTimer - 타이머 포맷 함수
 * @param {boolean} disabled - 비활성화 여부
 * @param {boolean} hidden - 숨김 여부 (공간은 차지)
 */
const FormInputWithButtonAndTimer = ({
  label,
  required = false,
  name,
  placeholder = '',
  value,
  onChange,
  buttonText,
  onButtonClick,
  validation = { isValid: null, message: '' },
  timer = 0,
  formatTimer,
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
          type="text"
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
      {/* 메시지와 타이머 (타이머는 오른쪽 고정) */}
      <div className={styles.errorContainer}>
        {validation.isValid !== null && validation.message && (
          <p className={validation.isValid ? styles.successMsg : styles.errorMsg}>
            {validation.message}
          </p>
        )}
        {timer > 0 && (
          <span className={styles.timer}>{formatTimer(timer)}</span>
        )}
      </div>
    </div>
  );
};

export default FormInputWithButtonAndTimer;

