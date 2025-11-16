import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ChangePasswordPage.module.css';
import FormInputField from '../../../components/signup/FormInputField';
import { validatePassword, validateConfirmPassword } from '../../../utils/validation';

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [validationMessages, setValidationMessages] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // 유효성 검사 실행
    let validationResult = { isValid: null, message: '' };
    
    switch (name) {
      case 'currentPassword':
        // 현재 비밀번호는 비어있지 않으면 됨
        if (!value) {
          validationResult = { isValid: null, message: '' };
        } else {
          validationResult = { isValid: true, message: '' };
        }
        break;
      case 'newPassword':
        validationResult = validatePassword(value);
        // 새 비밀번호가 변경되면 비밀번호 확인도 다시 검증
        if (formData.confirmPassword) {
          const confirmResult = validateConfirmPassword(value, formData.confirmPassword);
          setValidationMessages(prev => ({
            ...prev,
            confirmPassword: confirmResult
          }));
        }
        break;
      case 'confirmPassword':
        validationResult = validateConfirmPassword(formData.newPassword, value);
        break;
      default:
        break;
    }

    setValidationMessages(prev => ({
      ...prev,
      [name]: validationResult
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 최종 유효성 검사
    const isCurrentPasswordValid = formData.currentPassword.trim().length > 0;
    const isNewPasswordValid = validationMessages?.newPassword?.isValid === true;
    const isConfirmPasswordValid = validationMessages?.confirmPassword?.isValid === true;

    if (!isCurrentPasswordValid) {
      alert('현재 비밀번호를 입력해주세요.');
      return;
    }

    if (!isNewPasswordValid || !isConfirmPasswordValid) {
      alert('입력한 정보를 확인해주세요.');
      return;
    }

    // TODO: 실제 API 호출로 교체
    // const response = await changePassword({
    //   currentPassword: formData.currentPassword,
    //   newPassword: formData.newPassword
    // });

    // 개발용: 성공 가정
    console.log('비밀번호 변경 요청:', {
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword
    });

    alert('비밀번호가 변경되었습니다.');
    navigate('/my');
  };

  const isFormValid = 
    formData.currentPassword.trim().length > 0 &&
    validationMessages?.newPassword?.isValid === true &&
    validationMessages?.confirmPassword?.isValid === true;

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h1>비밀번호 변경</h1>
      </div>

      <div className={styles.content}>
        <div className={styles.card}>
          <div className={styles.stepContent}>
            <FormInputField
              label="현재 비밀번호"
              required
              name="currentPassword"
              type="password"
              placeholder="현재 비밀번호를 입력해주세요"
              value={formData.currentPassword}
              onChange={handleInputChange}
              validation={validationMessages?.currentPassword || { isValid: null, message: '' }}
            />

            <FormInputField
              label="새 비밀번호"
              required
              name="newPassword"
              type="password"
              placeholder="비밀번호는 영문, 숫자, 특수문자를 포함한 8자"
              value={formData.newPassword}
              onChange={handleInputChange}
              validation={validationMessages?.newPassword || { isValid: null, message: '' }}
            />

            <FormInputField
              label="새 비밀번호 확인"
              required
              name="confirmPassword"
              type="password"
              placeholder="새 비밀번호를 다시 입력해주세요"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              validation={validationMessages?.confirmPassword || { isValid: null, message: '' }}
            />
          </div>
        </div>

        <div className={styles.buttonSection}>
          <button
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={!isFormValid}
          >
            비밀번호 변경
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
