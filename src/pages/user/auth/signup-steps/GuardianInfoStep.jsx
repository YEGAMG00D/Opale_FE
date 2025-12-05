import React from 'react';
import styles from '../SignupPage.module.css';
import FormInputField from '../../../../components/signup/FormInputField';

const GuardianInfoStep = ({ formData, handleInputChange, validationMessages, onNext }) => {
  const guardianNameValidation = validationMessages?.guardianName || { isValid: null, message: '' };

  return (
    <div className={styles.stepContent}>
      <p className={styles.description} style={{ marginBottom: '24px', textAlign: 'left' }}>
        만 14세 미만 회원은 서비스를 이용하기 위해 보호자의 동의와 인증을 받아야 합니다.
      </p>

      <FormInputField
        label="보호자 이름"
        required
        name="guardianName"
        type="text"
        placeholder="보호자 이름을 입력해주세요"
        value={formData.guardianName || ''}
        onChange={handleInputChange}
        validation={guardianNameValidation}
      />

      <button
        className={styles.nextButton}
        onClick={onNext}
        disabled={!guardianNameValidation?.isValid}
        style={{
          width: '100%',
          marginTop: '40px',
          padding: '16px',
          backgroundColor: !guardianNameValidation?.isValid ? '#f5f5f5' : '#ffb6c1',
          color: !guardianNameValidation?.isValid ? '#999' : '#ffffff',
          border: 'none',
          borderRadius: '25px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: !guardianNameValidation?.isValid ? 'not-allowed' : 'pointer',
        }}
      >
        다음
      </button>
    </div>
  );
};

export default GuardianInfoStep;



