import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ChangePasswordPage.module.css';
import FormInputField from '../../../components/signup/FormInputField';
import { validatePassword, validateConfirmPassword } from '../../../utils/validation';
import { changePassword } from '../../../api/userApi';

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
        if (!value.trim()) {
          validationResult = { isValid: false, message: '현재 비밀번호를 입력해주세요.' };
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
    const isCurrentPasswordValid = validationMessages?.currentPassword?.isValid === true;
    const isNewPasswordValid = validationMessages?.newPassword?.isValid === true;
    const isConfirmPasswordValid = validationMessages?.confirmPassword?.isValid === true;

    if (!isCurrentPasswordValid || !isNewPasswordValid || !isConfirmPasswordValid) {
      alert('입력한 정보를 확인해주세요.');
      return;
    }

    try {
      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      alert('비밀번호가 변경되었습니다.');
      navigate('/my');
    } catch (err) {
      console.error('비밀번호 변경 실패:', err);
      
      // 현재 비밀번호가 틀린 경우
      if (err.response?.status === 400 || err.response?.status === 401) {
        setValidationMessages(prev => ({
          ...prev,
          currentPassword: { isValid: false, message: '현재 비밀번호가 올바르지 않습니다.' }
        }));
        alert('현재 비밀번호가 올바르지 않습니다.');
      } else {
        alert(err.message || '비밀번호 변경에 실패했습니다.');
      }
    }
  };

  const isFormValid = 
    validationMessages?.currentPassword?.isValid === true &&
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
