import React from 'react';
import styles from '../SignupPage.module.css';

const Step1EmailVerification = ({ formData, handleInputChange, handleResendCode, handleVerifyCode, timer, formatTimer, validationMessages }) => {
  const emailValidation = validationMessages?.email || { isValid: null, message: '' };
  const codeValidation = validationMessages?.verificationCode || { isValid: null, message: '' };

  return (
    <div className={styles.stepContent}>
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
            onClick={handleResendCode}
          >
            인증번호 재전송
          </button>
        </div>
        {emailValidation.isValid !== null && emailValidation.message && (
          <p className={emailValidation.isValid ? styles.successMsg : styles.errorMsg}>
            {emailValidation.message}
          </p>
        )}
      </div>

      <div className={styles.inputGroup}>
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
          />
          <button
            type="button"
            className={styles.smallButton}
            onClick={handleVerifyCode}
          >
            인증번호 확인
          </button>
        </div>
        <div className={styles.errorContainer}>
          {codeValidation.isValid !== null && codeValidation.message && (
            <p className={codeValidation.isValid ? styles.successMsg : styles.errorMsg}>
              {codeValidation.message}
            </p>
          )}
          <span className={styles.timer}>{formatTimer(timer)}</span>
        </div>
      </div>
    </div>
  );
};

export default Step1EmailVerification;

