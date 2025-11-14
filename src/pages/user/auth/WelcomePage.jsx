import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styles from './WelcomePage.module.css';

const WelcomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const nickname = location.state?.nickname || '닉네임';

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <Link to="/" className={styles.headerLogo}>opale</Link>
          </div>
          <div className={styles.headerRight}>
            <Link to="/login" className={styles.loginBtn}>로그인</Link>
          </div>
        </div>
        <div className={styles.headerDivider}></div>
      </div>

      <div className={styles.content}>
        <h1 className={styles.title}>회원가입 성공</h1>

        <div className={styles.card}>
          <p className={styles.welcomeText}>{nickname} 님, 환영합니다!</p>
          
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

          <div className={styles.messageContainer}>
            <p className={styles.message}>Opale의 다양한 공연 관련 정보로</p>
            <p className={styles.message}>즐거운 문화 생활 되기를</p>
          </div>
        </div>

        <button
          className={styles.loginButton}
          onClick={() => navigate("/login")}
        >
          로그인 페이지로 이동
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
