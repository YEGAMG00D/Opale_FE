import React from 'react';
import styles from './OcrLoadingSpinner.module.css';

const OcrLoadingSpinner = ({ message = '티켓 이미지를 분석 중입니다...', subMessage = '잠시만 기다려주세요' }) => {
  return (
    <div className={styles.container}>
      <div className={styles.spinnerWrapper}>
        <div className={styles.spinner}>
          <div className={styles.spinnerRing}></div>
          <div className={styles.spinnerRing}></div>
          <div className={styles.spinnerRing}></div>
        </div>
      </div>
      <p className={styles.message}>{message}</p>
      <p className={styles.subMessage}>{subMessage}</p>
    </div>
  );
};

export default OcrLoadingSpinner;

