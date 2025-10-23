import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  return (
    <div className={styles.container}>
      <h1>로그인</h1>
      <p>로그인 페이지입니다.</p>
      
      <div className={styles.navigation}>
        <h2>회원가입 관련</h2>
        <div className={styles.linkGrid}>
          <Link to="/signup" className={styles.link}>회원가입</Link>
          <Link to="/signup/welcome" className={styles.link}>회원가입 축하</Link>
        </div>
      </div>
      
      <div className={styles.navigation}>
        <h2>메인 페이지로 이동</h2>
        <div className={styles.linkGrid}>
          <Link to="/" className={styles.link}>홈</Link>
          <Link to="/my" className={styles.link}>마이페이지</Link>
          <Link to="/culture" className={styles.link}>공연</Link>
          <Link to="/place" className={styles.link}>공연장</Link>
          <Link to="/chat" className={styles.link}>채팅</Link>
          <Link to="/recommend" className={styles.link}>추천</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
