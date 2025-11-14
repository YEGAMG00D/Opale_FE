import React from 'react';
import styles from '../SignupPage.module.css';

const Step3PersonalInfo = ({ formData, handleInputChange, handleCheckNickname }) => {
  return (
    <div className={styles.stepContent}>
      <div className={styles.inputGroup}>
        <label className={styles.label}>
          닉네임 <span className={styles.required}>*</span>
        </label>
        <div className={styles.inputWithButton}>
          <input
            type="text"
            name="nickname"
            className={styles.input}
            placeholder="2자 이상 10자 이하"
            value={formData.nickname}
            onChange={handleInputChange}
          />
          <button
            type="button"
            className={styles.smallButton}
            onClick={handleCheckNickname}
          >
            닉네임 중복확인
          </button>
        </div>
        <p className={styles.successMsg}>사용가능한 닉네임입니다.</p>
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>
          성명 <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          name="name"
          className={styles.input}
          placeholder="Value"
          value={formData.name}
          onChange={handleInputChange}
        />
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>
          성별 <span className={styles.required}>*</span>
        </label>
        <div className={styles.radioGroup}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="gender"
              value="male"
              checked={formData.gender === 'male'}
              onChange={handleInputChange}
            />
            <span>남성</span>
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="gender"
              value="female"
              checked={formData.gender === 'female'}
              onChange={handleInputChange}
            />
            <span>여성</span>
          </label>
        </div>
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>
          생년월일 <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          name="birthDate"
          className={styles.input}
          placeholder="YYYYMMdd"
          value={formData.birthDate}
          onChange={handleInputChange}
        />
        <p className={styles.errorMsg}>인증번호가 일치하지 않습니다.</p>
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>
          연락처 <span className={styles.required}>*</span>
        </label>
        <input
          type="tel"
          name="phone"
          className={styles.input}
          placeholder="01012341234"
          value={formData.phone}
          onChange={handleInputChange}
        />
        <p className={styles.errorMsg}>인증번호가 일치하지 않습니다.</p>
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>
          주소 <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          name="address"
          className={styles.input}
          placeholder="Value"
          value={formData.address}
          onChange={handleInputChange}
        />
        <p className={styles.errorMsg}>인증번호가 일치하지 않습니다.</p>
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>
          상세주소 <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          name="detailAddress"
          className={styles.input}
          placeholder="Value"
          value={formData.detailAddress}
          onChange={handleInputChange}
        />
        <p className={styles.errorMsg}>인증번호가 일치하지 않습니다.</p>
      </div>

      <div className={styles.termsSection}>
        <textarea
          className={styles.termsText}
          readOnly
          value="opale에서는 ~~~할 수 있습니다."
        />
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleInputChange}
          />
          <span>위 사항에 동의합니다. <span className={styles.required}>*</span></span>
        </label>
      </div>
    </div>
  );
};

export default Step3PersonalInfo;

