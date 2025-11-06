import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './SignupPage.module.css';

const SignupPage = () => {
  const navigate = useNavigate();

  const handleUnder14 = () => {
    // 만 14세 미만 회원가입 처리
    console.log('Under 14 signup');
    // navigate('/signup/under14');
  };

  const handleOver14 = () => {
    // 만 14세 이상 회원가입 처리
    console.log('Over 14 signup');
    // navigate('/signup/form');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          ←
        </button>
        <h1 className={styles.headerTitle}>회원가입</h1>
      </div>

      <div className={styles.content}>
        <div className={styles.logoSection}>
          <div className={styles.logo}>opale</div>
          <div className={styles.decorativeElements}>
            <div className={styles.dotPink1}></div>
            <div className={styles.dotPink2}></div>
            <div className={styles.dotBlue1}></div>
            <div className={styles.dotBlue2}></div>
            <div className={styles.starPink1}></div>
            <div className={styles.starBlue1}></div>
          </div>
        </div>

        <div className={styles.questionSection}>
          <h2 className={styles.question}>만 14세 미만 이용자입니까?</h2>
          <p className={styles.description}>
            본인에 해당하는 회원유형을 정확히 선택해 주세요.
          </p>
        </div>

        <div className={styles.buttonSection}>
          <button className={styles.primaryButton} onClick={handleUnder14}>
            예, 만 14세 미만입니다
          </button>
          <button className={styles.secondaryLink} onClick={handleOver14}>
            아니요, 만 14세 이상입니다
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
