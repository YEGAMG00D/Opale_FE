import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PerformanceSignalPage.module.css';

const PerformanceSignalPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.icon}>🎭</div>
        <h1 className={styles.title}>공연시그널</h1>
        <p className={styles.description}>준비 중입니다</p>
        <p className={styles.subDescription}>
          곧 나와 찰떡인 공연을 찾아드릴 수 있도록 준비 중입니다
        </p>
        <button 
          className={styles.backButton}
          onClick={() => navigate('/recommend')}
        >
          뒤로 가기
        </button>
      </div>
    </div>
  );
};

export default PerformanceSignalPage;

