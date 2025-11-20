import React, { useState } from 'react';
import styles from '../SignupPage.module.css';

const TermsAgreementStep = ({ formData, handleInputChange, onNext }) => {
  const [agreements, setAgreements] = useState({
    allAgreed: false,
    serviceTerms: false,
    privacyPolicy: false,
  });

  const handleAgreementChange = (name, checked) => {
    if (name === 'allAgreed') {
      const newState = {
        allAgreed: checked,
        serviceTerms: checked,
        privacyPolicy: checked,
      };
      setAgreements(newState);
      handleInputChange({ target: { name: 'agreeToTerms', type: 'checkbox', checked } });
    } else {
      const newAgreements = {
        ...agreements,
        [name]: checked,
      };
      newAgreements.allAgreed = 
        newAgreements.serviceTerms &&
        newAgreements.privacyPolicy;
      
      setAgreements(newAgreements);
      
      if (name === 'serviceTerms' || name === 'privacyPolicy') {
        handleInputChange({ 
          target: { 
            name: 'agreeToTerms', 
            type: 'checkbox', 
            checked: newAgreements.allAgreed 
          } 
        });
      }
    }
  };

  const isNextDisabled = !agreements.serviceTerms || !agreements.privacyPolicy;

  return (
    <div className={styles.stepContent}>
      <p className={styles.description} style={{ marginBottom: '24px', textAlign: 'left' }}>
        서비스를 이용하기 위해서 약관동의가 필요합니다.
      </p>

      <div className={styles.termsSection}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={agreements.allAgreed}
            onChange={(e) => handleAgreementChange('allAgreed', e.target.checked)}
          />
          <span>모두 확인, 동의합니다.</span>
        </label>

        <div style={{ height: '1px', backgroundColor: '#e0e0e0', margin: '12px 0' }}></div>

        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={agreements.serviceTerms}
            onChange={(e) => handleAgreementChange('serviceTerms', e.target.checked)}
          />
          <span>
            <span className={styles.required}>(필수)</span>
            <span style={{ textDecoration: 'underline' }}>서비스 이용약관</span>
          </span>
        </label>

        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={agreements.privacyPolicy}
            onChange={(e) => handleAgreementChange('privacyPolicy', e.target.checked)}
          />
          <span>
            <span className={styles.required}>(필수)</span>
            <span style={{ textDecoration: 'underline' }}>개인정보 수집 및 이용동의</span>
          </span>
        </label>
      </div>

      <button
        className={styles.nextButton}
        onClick={onNext}
        disabled={isNextDisabled}
        style={{
          width: '100%',
          marginTop: '40px',
          padding: '16px',
          backgroundColor: isNextDisabled ? '#f5f5f5' : '#ffb6c1',
          color: isNextDisabled ? '#999' : '#ffffff',
          border: 'none',
          borderRadius: '25px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: isNextDisabled ? 'not-allowed' : 'pointer',
        }}
      >
        다음
      </button>
    </div>
  );
};

export default TermsAgreementStep;
