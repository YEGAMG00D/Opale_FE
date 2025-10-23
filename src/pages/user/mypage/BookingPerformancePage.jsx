import React from 'react';
import styles from './BookingPerformancePage.module.css';

const BookingPerformancePage = () => {
  return (
    <div className={styles.container}>
      <h1>예매한 공연 목록</h1>
      <p>사용자가 예매한 공연 목록을 보여주는 페이지입니다.</p>
    </div>
  );
};

export default BookingPerformancePage;
