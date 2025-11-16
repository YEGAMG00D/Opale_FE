import React from 'react';
import styles from '../SignupPage.module.css';
import FormInputWithButton from '../../../../components/signup/FormInputWithButton';
import FormInputWithButtonAndTimer from '../../../../components/signup/FormInputWithButtonAndTimer';

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
      <FormInputWithButton
        label="이메일"
        required
        name="email"
        type="email"
        placeholder="user@example.com"
        value={formData.email}
        onChange={handleInputChange}
        buttonText={isCodeSent ? '인증번호 재전송' : '인증번호 전송'}
        onButtonClick={isCodeSent ? handleResendCode : handleSendCode}
        validation={emailValidation}
      />

      {/* 인증번호 입력 영역 (항상 공간 차지, 전송 성공 시에만 보임) */}
      <FormInputWithButtonAndTimer
        label="인증번호"
        required
        name="verificationCode"
        placeholder="123456"
        value={formData.verificationCode}
        onChange={handleInputChange}
        buttonText="인증번호 확인"
        onButtonClick={handleVerifyCode}
        validation={codeValidation}
        timer={timer}
        formatTimer={formatTimer}
        disabled={!isCodeSent}
        hidden={!isCodeSent}
      />
    </div>
  );
};

export default Step1EmailVerification;

