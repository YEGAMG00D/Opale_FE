import React from 'react';
import { Link } from 'react-router-dom';
import styles from './MainRecommandPage.module.css';

const MainRecommandPage = () => {
  return (
    <div className={styles.container}>
      <h1>추천</h1>
      <p>사용자에게 맞춤 공연을 추천하는 페이지입니다.</p>
      
      <div className={styles.navigation}>
        <h2>다른 페이지로 이동</h2>
        <div className={styles.linkGrid}>
          <Link to="/" className={styles.link}>홈</Link>
          <Link to="/my" className={styles.link}>마이페이지</Link>
          <Link to="/culture" className={styles.link}>공연</Link>
          <Link to="/place" className={styles.link}>공연장</Link>
          <Link to="/chat" className={styles.link}>채팅</Link>
        </div>
      </div>
    </div>
  );
};

export default MainRecommandPage;
