import React from 'react';
import styles from '../SignupPage.module.css';

const Step2Password = ({ formData, handleInputChange }) => {
  return (
    <div className={styles.stepContent}>
      <div className={styles.inputGroup}>
        <label className={styles.label}>
          비밀번호 <span className={styles.required}>*</span>
        </label>
        <input
          type="password"
          name="password"
          className={styles.input}
          placeholder="비밀번호는 영문, 숫자, 특수문자를 포함한 8자"
          value={formData.password}
          onChange={handleInputChange}
        />
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>
          비밀번호 확인 <span className={styles.required}>*</span>
        </label>
        <input
          type="password"
          name="confirmPassword"
          className={styles.input}
          placeholder="비밀번호 확인"
          value={formData.confirmPassword}
          onChange={handleInputChange}
        />
        <p className={styles.errorMsg}>비밀번호와 일치하지 않습니다.</p>
      </div>
    </div>
  );
};

export default Step2Password;

