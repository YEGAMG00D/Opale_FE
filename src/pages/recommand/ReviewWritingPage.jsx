import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './ReviewWritingPage.module.css';

const ReviewWritingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const ticketData = location.state?.ticketData || {
    performanceName: '뮤지컬 위키드 내한공연',
    performanceDate: '2025-10-23',
    performanceTime: '19:00',
    section: '나 구역',
    row: '15',
    number: '23'
  };

  const [reviewData, setReviewData] = useState({
    performanceReview: '',
    venueReview: ''
  });

  const handleInputChange = (field, value) => {
    setReviewData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRegister = () => {
    // 리뷰 등록 로직
    console.log('리뷰 등록:', { ticketData, reviewData });
    navigate('/recommend');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.title}>리뷰 작성</div>
        
        <div className={styles.form}>
          <div className={styles.formGroup}>
            <label>앞에서 입력한 공연 정보</label>
            <div className={styles.infoDisplay}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>공연명:</span>
                <span>{ticketData.performanceName}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>공연일자:</span>
                <span>{ticketData.performanceDate} {ticketData.performanceTime}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>좌석정보:</span>
                <span>{ticketData.section} {ticketData.row}열 {ticketData.number}번</span>
              </div>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>공연 리뷰</label>
            <textarea
              value={reviewData.performanceReview}
              onChange={(e) => handleInputChange('performanceReview', e.target.value)}
              placeholder="공연에 대한 리뷰를 작성해주세요"
              rows={6}
              className={styles.textarea}
            />
          </div>

          <div className={styles.formGroup}>
            <label>공연장 리뷰</label>
            <textarea
              value={reviewData.venueReview}
              onChange={(e) => handleInputChange('venueReview', e.target.value)}
              placeholder="공연장에 대한 리뷰를 작성해주세요"
              rows={6}
              className={styles.textarea}
            />
          </div>
        </div>

        <button 
          className={styles.primaryButton}
          onClick={handleRegister}
        >
          리뷰 등록
        </button>
      </div>
    </div>
  );
};

export default ReviewWritingPage;

