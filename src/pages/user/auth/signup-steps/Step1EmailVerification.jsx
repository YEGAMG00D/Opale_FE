import React from 'react';
import styles from '../SignupPage.module.css';

const Step1EmailVerification = ({ 
  formData, 
  handleInputChange, 
  handleSendCode,
  handleResendCode, 
  handleVerifyCode, 
  timer, 
  formatTimer, 
  validationMessages,
  isCodeSent 
}) => {
  const emailValidation = validationMessages?.email || { isValid: null, message: '' };
  const codeValidation = validationMessages?.verificationCode || { isValid: null, message: '' };

  return (
    <div className={styles.stepContent}>
      {/* 이메일 입력 영역 */}
      <div className={styles.inputGroup}>
        <label className={styles.label}>
          이메일 <span className={styles.required}>*</span>
        </label>
        <div className={styles.inputWithButton}>
          <input
            type="email"
            name="email"
            className={styles.input}
            placeholder="user@example.com"
            value={formData.email}
            onChange={handleInputChange}
          />
          <button
            type="button"
            className={styles.smallButton}
            onClick={isCodeSent ? handleResendCode : handleSendCode}
          >
            {isCodeSent ? '인증번호 재전송' : '인증번호 전송'}
          </button>
        </div>
        {/* 이메일 입력 중 유효성 검사 메시지 또는 전송 결과 메시지 */}
        {emailValidation.isValid !== null && emailValidation.message && (
          <p className={emailValidation.isValid ? styles.successMsg : styles.errorMsg}>
            {emailValidation.message}
          </p>
        )}
      </div>

      {/* 인증번호 입력 영역 (항상 공간 차지, 전송 성공 시에만 보임) */}
      <div className={`${styles.inputGroup} ${!isCodeSent ? styles.hidden : ''}`}>
        <label className={styles.label}>
          인증번호 <span className={styles.required}>*</span>
        </label>
        <div className={styles.inputWithButton}>
          <input
            type="text"
            name="verificationCode"
            className={styles.input}
            placeholder="123456"
            value={formData.verificationCode}
            onChange={handleInputChange}
            disabled={!isCodeSent}
          />
          <button
            type="button"
            className={styles.smallButton}
            onClick={handleVerifyCode}
            disabled={!isCodeSent}
          >
            인증번호 확인
          </button>
        </div>
        {/* 인증번호 유효성 검사 메시지 또는 확인 성공 메시지와 타이머 (타이머는 오른쪽 고정) */}
        <div className={styles.errorContainer}>
          {codeValidation.isValid !== null && codeValidation.message && (
            <p className={codeValidation.isValid ? styles.successMsg : styles.errorMsg}>
              {codeValidation.message}
            </p>
          )}
          {timer > 0 && (
            <span className={styles.timer}>{formatTimer(timer)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step1EmailVerification;

