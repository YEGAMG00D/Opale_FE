import React from 'react';
import { Link } from 'react-router-dom';
import styles from './MainChatPage.module.css';

const MainChatPage = () => {
  return (
    <div className={styles.container}>
      <h1>채팅</h1>
      <p>다양한 오픈 채팅방을 탐색할 수 있는 페이지입니다.</p>
      
      <div className={styles.navigation}>
        <h2>채팅 관련 메뉴</h2>
        <div className={styles.linkGrid}>
          <Link to="/chat/search" className={styles.link}>채팅방 검색</Link>
          <Link to="/chat/1" className={styles.link}>채팅방 (예시)</Link>
        </div>
      </div>
      
      <div className={styles.navigation}>
        <h2>다른 페이지로 이동</h2>
        <div className={styles.linkGrid}>
          <Link to="/" className={styles.link}>홈</Link>
          <Link to="/my" className={styles.link}>마이페이지</Link>
          <Link to="/culture" className={styles.link}>공연</Link>
          <Link to="/place" className={styles.link}>공연장</Link>
          <Link to="/recommend" className={styles.link}>추천</Link>
        </div>
      </div>
    </div>
  );
};

export default MainChatPage;
