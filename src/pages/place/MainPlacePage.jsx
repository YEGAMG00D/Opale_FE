import React from 'react';
import { Link } from 'react-router-dom';
import styles from './MainPlacePage.module.css';

const MainPlacePage = () => {
  return (
    <div className={styles.container}>
      <h1>공연장</h1>
      <p>다양한 공연장 및 장소 정보를 탐색할 수 있는 페이지입니다.</p>
      
      <div className={styles.navigation}>
        <h2>공연장 관련 메뉴</h2>
        <div className={styles.linkGrid}>
          <Link to="/place/search" className={styles.link}>공연장 검색</Link>
          <Link to="/place/1" className={styles.link}>공연장 상세 (예시)</Link>
        </div>
      </div>
      
      <div className={styles.navigation}>
        <h2>다른 페이지로 이동</h2>
        <div className={styles.linkGrid}>
          <Link to="/" className={styles.link}>홈</Link>
          <Link to="/my" className={styles.link}>마이페이지</Link>
          <Link to="/culture" className={styles.link}>공연</Link>
          <Link to="/chat" className={styles.link}>채팅</Link>
          <Link to="/recommend" className={styles.link}>추천</Link>
        </div>
      </div>
    </div>
  );
};

export default MainPlacePage;
