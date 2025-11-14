import React from 'react';
import styles from '../SignupPage.module.css';

const Step3PersonalInfo = ({ formData, handleInputChange, handleCheckNickname, validationMessages }) => {
  const nicknameValidation = validationMessages?.nickname || { isValid: null, message: '' };
  const nameValidation = validationMessages?.name || { isValid: null, message: '' };
  const birthDateValidation = validationMessages?.birthDate || { isValid: null, message: '' };
  const phoneValidation = validationMessages?.phone || { isValid: null, message: '' };
  const addressValidation = validationMessages?.address || { isValid: null, message: '' };
  const detailAddressValidation = validationMessages?.detailAddress || { isValid: null, message: '' };

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
        {nicknameValidation.isValid !== null && nicknameValidation.message && (
          <p className={nicknameValidation.isValid ? styles.successMsg : styles.errorMsg}>
            {nicknameValidation.message}
          </p>
        )}
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
        {nameValidation.isValid !== null && nameValidation.message && (
          <p className={nameValidation.isValid ? styles.successMsg : styles.errorMsg}>
            {nameValidation.message}
          </p>
        )}
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
        {birthDateValidation.isValid !== null && birthDateValidation.message && (
          <p className={birthDateValidation.isValid ? styles.successMsg : styles.errorMsg}>
            {birthDateValidation.message}
          </p>
        )}
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
        {phoneValidation.isValid !== null && phoneValidation.message && (
          <p className={phoneValidation.isValid ? styles.successMsg : styles.errorMsg}>
            {phoneValidation.message}
          </p>
        )}
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
        {addressValidation.isValid !== null && addressValidation.message && (
          <p className={addressValidation.isValid ? styles.successMsg : styles.errorMsg}>
            {addressValidation.message}
          </p>
        )}
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
        {detailAddressValidation.isValid !== null && detailAddressValidation.message && (
          <p className={detailAddressValidation.isValid ? styles.successMsg : styles.errorMsg}>
            {detailAddressValidation.message}
          </p>
        )}
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

