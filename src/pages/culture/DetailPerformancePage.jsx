import React from 'react';
import { Link } from 'react-router-dom';
import styles from './DetailPerformancePage.module.css';

const DetailPerformancePage = () => {
  return (
    <div className={styles.container}>
      <h1>공연 상세</h1>
      <p>선택한 공연의 상세 정보를 보여주는 페이지입니다.</p>
      
      <div className={styles.navigation}>
        <h2>공연 관련 기능</h2>
        <div className={styles.linkGrid}>
          <Link to="/culture/review" className={styles.link}>공연 후기 작성</Link>
          <Link to="/culture/search" className={styles.link}>다른 공연 검색</Link>
        </div>
      </div>
      
      <div className={styles.navigation}>
        <h2>다른 페이지로 이동</h2>
        <div className={styles.linkGrid}>
          <Link to="/" className={styles.link}>홈</Link>
          <Link to="/my" className={styles.link}>마이페이지</Link>
          <Link to="/culture" className={styles.link}>공연 목록</Link>
          <Link to="/place" className={styles.link}>공연장</Link>
          <Link to="/chat" className={styles.link}>채팅</Link>
          <Link to="/recommend" className={styles.link}>추천</Link>
        </div>
      </div>
    </div>
  );
};

export default DetailPerformancePage;
