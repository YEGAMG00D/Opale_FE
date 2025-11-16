import React from 'react';
import styles from '../SignupPage.module.css';
import FormInputField from '../../../../components/signup/FormInputField';
import FormInputWithButton from '../../../../components/signup/FormInputWithButton';

const Step3PersonalInfo = ({ formData, handleInputChange, handleCheckNickname, validationMessages }) => {
  const nicknameValidation = validationMessages?.nickname || { isValid: null, message: '' };
  const nameValidation = validationMessages?.name || { isValid: null, message: '' };
  const birthDateValidation = validationMessages?.birthDate || { isValid: null, message: '' };
  const phoneValidation = validationMessages?.phone || { isValid: null, message: '' };
  const addressValidation = validationMessages?.address || { isValid: null, message: '' };
  const detailAddressValidation = validationMessages?.detailAddress || { isValid: null, message: '' };

  return (
    <div className={styles.stepContent}>
      <FormInputWithButton
        label="닉네임"
        required
        name="nickname"
        type="text"
        placeholder="2자 이상 10자 이하"
        value={formData.nickname}
        onChange={handleInputChange}
        buttonText="닉네임 중복확인"
        onButtonClick={handleCheckNickname}
        validation={nicknameValidation}
      />

      <FormInputField
        label="성명"
        required
        name="name"
        type="text"
        placeholder="Value"
        value={formData.name}
        onChange={handleInputChange}
        validation={nameValidation}
      />

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

      <FormInputField
        label="생년월일"
        required
        name="birthDate"
        type="text"
        placeholder="YYYYMMdd"
        value={formData.birthDate}
        onChange={handleInputChange}
        validation={birthDateValidation}
      />

      <FormInputField
        label="연락처"
        required
        name="phone"
        type="tel"
        placeholder="01012341234"
        value={formData.phone}
        onChange={handleInputChange}
        validation={phoneValidation}
      />

      <FormInputField
        label="주소"
        required
        name="address"
        type="text"
        placeholder="Value"
        value={formData.address}
        onChange={handleInputChange}
        validation={addressValidation}
      />

      <FormInputField
        label="상세주소"
        required
        name="detailAddress"
        type="text"
        placeholder="Value"
        value={formData.detailAddress}
        onChange={handleInputChange}
        validation={detailAddressValidation}
      />

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

