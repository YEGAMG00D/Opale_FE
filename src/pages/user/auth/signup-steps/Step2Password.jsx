import React from 'react';
import styles from '../SignupPage.module.css';
import FormInputField from '../../../../components/signup/FormInputField';

const Step2Password = ({ formData, handleInputChange, validationMessages, onNext }) => {
  const passwordValidation = validationMessages?.password || { isValid: null, message: '' };
  const confirmPasswordValidation = validationMessages?.confirmPassword || { isValid: null, message: '' };

  // 비밀번호 확인 필드에서 엔터 키 입력 시 다음 버튼 클릭
  const handleEnterKeyPress = () => {
    // 비밀번호와 비밀번호 확인이 모두 유효할 때만 다음 단계로 이동
    if (
      passwordValidation?.isValid === true &&
      confirmPasswordValidation?.isValid === true &&
      onNext
    ) {
      onNext();
    }
  };

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
        onEnterKeyPress={handleEnterKeyPress}
      />
    </div>
  );
};

export default Step2Password;

