import React from 'react';
import styles from '../SignupPage.module.css';

const Step1EmailVerification = ({ formData, handleInputChange, handleResendCode, handleVerifyCode, timer, formatTimer }) => {
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
        <p className={styles.successMsg}>인증번호를 전송하였습니다.</p>
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
          <p className={styles.errorMsg}>인증번호가 일치하지 않습니다.</p>
          <span className={styles.timer}>{formatTimer(timer)}</span>
        </div>
      </div>
    </div>
  );
};

export default Step1EmailVerification;

