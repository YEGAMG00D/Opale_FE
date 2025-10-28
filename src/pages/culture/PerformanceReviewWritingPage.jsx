import React from 'react';
import { Link } from 'react-router-dom';
import styles from './PerformanceReviewWritingPage.module.css';

const PerformanceReviewWritingPage = () => {
  return (
    <div className={styles.container}>
      <h1>공연 후기 작성</h1>
      <p>공연에 대한 후기를 작성해주세요.</p>
      
      <div className={styles.reviewForm}>
        <div className={styles.formGroup}>
          <label className={styles.label}>공연명</label>
          <input type="text" className={styles.input} placeholder="공연명을 입력하세요" />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>평점</label>
          <div className={styles.rating}>
            <span className={styles.star}>⭐</span>
            <span className={styles.star}>⭐</span>
            <span className={styles.star}>⭐</span>
            <span className={styles.star}>⭐</span>
            <span className={styles.star}>⭐</span>
          </div>
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>후기 내용</label>
          <textarea 
            className={styles.textarea} 
            placeholder="공연에 대한 후기를 작성해주세요..."
            rows={6}
          ></textarea>
        </div>
        
        <div className={styles.buttonGroup}>
          <button className={styles.submitBtn}>후기 등록</button>
          <button className={styles.cancelBtn}>취소</button>
        </div>
      </div>
      
      <div className={styles.navigation}>
        <h2>다른 페이지로 이동</h2>
        <div className={styles.linkGrid}>
          <Link to="/culture" className={styles.link}>공연 목록</Link>
          <Link to="/culture/1" className={styles.link}>공연 상세</Link>
          <Link to="/" className={styles.link}>홈</Link>
          <Link to="/my" className={styles.link}>마이페이지</Link>
          <Link to="/place" className={styles.link}>공연장</Link>
          <Link to="/chat" className={styles.link}>채팅</Link>
          <Link to="/recommend" className={styles.link}>추천</Link>
        </div>
      </div>
    </div>
  );
};

export default PerformanceReviewWritingPage;
