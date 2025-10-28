import React from 'react';
import { Link } from 'react-router-dom';
import styles from './MainHomePage.module.css';

const MainHomePage = () => {
  return (
    <div className={styles.container}>
      <h1>홈 페이지</h1>
      <p>여기에 홈 페이지 내용이 들어갑니다.</p>
      
      <div className={styles.navigation}>
        <h2>페이지 이동 테스트</h2>
        <div className={styles.linkGrid}>
          <Link to="/my" className={styles.link}>마이페이지</Link>
          <Link to="/culture" className={styles.link}>공연</Link>
          <Link to="/place" className={styles.link}>공연장</Link>
          <Link to="/chat" className={styles.link}>채팅</Link>
          <Link to="/recommend" className={styles.link}>추천</Link>
        </div>
      </div>
      
      <div style={{ height: '200vh' }}>
        <p>스크롤 테스트용 긴 콘텐츠입니다.</p>
        <p>본문 영역만 스크롤되어야 합니다.</p>
        <p>Header와 Footer는 고정되어 있어야 합니다.</p>
      </div>
    </div>
  );
};

export default MainHomePage;
