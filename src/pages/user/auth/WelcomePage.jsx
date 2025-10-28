import React from 'react';
import { Link } from 'react-router-dom';
import styles from './WelcomePage.module.css';

const WelcomePage = () => {
  return (
    <div className={styles.container}>
      <h1>회원가입 축하! 🎉</h1>
      <p>회원가입 후 성향 검사를 진행하는 페이지입니다.</p>
      
      <div className={styles.navigation}>
        <h2>다음 단계</h2>
        <div className={styles.linkGrid}>
          <Link to="/" className={styles.link}>홈으로 이동</Link>
          <Link to="/my" className={styles.link}>마이페이지</Link>
        </div>
      </div>
      
      <div className={styles.navigation}>
        <h2>다른 페이지로 이동</h2>
        <div className={styles.linkGrid}>
          <Link to="/login" className={styles.link}>로그인</Link>
          <Link to="/signup" className={styles.link}>회원가입</Link>
          <Link to="/culture" className={styles.link}>공연</Link>
          <Link to="/place" className={styles.link}>공연장</Link>
          <Link to="/chat" className={styles.link}>채팅</Link>
          <Link to="/recommend" className={styles.link}>추천</Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
