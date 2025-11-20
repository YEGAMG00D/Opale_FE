import React, { useState } from 'react';
import styles from '../SignupPage.module.css';

const GuardianAgreementStep = ({ formData, handleInputChange, onNext }) => {
  const [agreements, setAgreements] = useState({
    allAgreed: false,
    childServiceAgreement: false,
    childPaidServiceAgreement: false,
    guardianPrivacyAgreement: false,
  });

  const handleAgreementChange = (name, checked) => {
    if (name === 'allAgreed') {
      const newState = {
        allAgreed: checked,
        childServiceAgreement: checked,
        childPaidServiceAgreement: checked,
        guardianPrivacyAgreement: checked,
      };
      setAgreements(newState);
      handleInputChange({ target: { name: 'guardianAgreed', type: 'checkbox', checked } });
    } else {
      const newAgreements = {
        ...agreements,
        [name]: checked,
      };
      newAgreements.allAgreed = 
        newAgreements.childServiceAgreement &&
        newAgreements.childPaidServiceAgreement &&
        newAgreements.guardianPrivacyAgreement;
      
      setAgreements(newAgreements);
      
      handleInputChange({ 
        target: { 
          name: 'guardianAgreed', 
          type: 'checkbox', 
          checked: newAgreements.allAgreed 
        } 
      });
    }
  };

  const isNextDisabled = !agreements.childServiceAgreement || 
                         !agreements.childPaidServiceAgreement || 
                         !agreements.guardianPrivacyAgreement;

  return (
    <div className={styles.stepContent}>
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
            checked={agreements.childServiceAgreement}
            onChange={(e) => handleAgreementChange('childServiceAgreement', e.target.checked)}
          />
          <span>
            <span className={styles.required}>(필수)</span>
            <span style={{ textDecoration: 'underline' }}>어린이의 서비스 이용동의</span>
          </span>
        </label>

        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={agreements.childPaidServiceAgreement}
            onChange={(e) => handleAgreementChange('childPaidServiceAgreement', e.target.checked)}
          />
          <span>
            <span className={styles.required}>(필수)</span>
            <span style={{ textDecoration: 'underline' }}>어린이의 유료 서비스 이용동의</span>
          </span>
        </label>

        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={agreements.guardianPrivacyAgreement}
            onChange={(e) => handleAgreementChange('guardianPrivacyAgreement', e.target.checked)}
          />
          <span>
            <span className={styles.required}>(필수)</span>
            <span style={{ textDecoration: 'underline' }}>보호자 개인정보 수집 및 이용 동의</span>
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

export default GuardianAgreementStep;

