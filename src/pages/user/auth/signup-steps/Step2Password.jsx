import React from 'react';
import styles from '../SignupPage.module.css';
import FormInputField from '../../../../components/signup/FormInputField';

const Step2Password = ({ formData, handleInputChange, validationMessages }) => {
  const passwordValidation = validationMessages?.password || { isValid: null, message: '' };
  const confirmPasswordValidation = validationMessages?.confirmPassword || { isValid: null, message: '' };

  return (
    <div className={styles.stepContent}>
      <FormInputField
        label="비밀번호"
        required
        name="password"
        type="password"
        placeholder="비밀번호는 영문, 숫자, 특수문자를 포함한 8자"
        value={formData.password}
        onChange={handleInputChange}
        validation={passwordValidation}
      />

      <FormInputField
        label="비밀번호 확인"
        required
        name="confirmPassword"
        type="password"
        placeholder="비밀번호 확인"
        value={formData.confirmPassword}
        onChange={handleInputChange}
        validation={confirmPasswordValidation}
      />
    </div>
  );
};

export default Step2Password;

