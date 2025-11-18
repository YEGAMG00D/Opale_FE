import React from 'react';
import styles from './PerformanceInfoCard.module.css';

const PerformanceInfoCard = ({
  category,
  title,
  englishTitle,
  venue,
  address,
  date,
  duration,
  ageLimit
}) => {
  return (
    <div className={styles.infoCard}>
      <div className={styles.categoryTag}>{category}</div>
      <h1 className={styles.performanceTitle}>
        {title}
      </h1>
      <div className={styles.infoRow}>
        <div className={styles.infoLabel}>공연장</div>
        <div className={styles.infoContent}>
          <div className={styles.infoValue}>{venue}</div>
          <div className={styles.infoAddress}>{address}</div>
        </div>
      </div>
      <div className={styles.infoRow}>
        <div className={styles.infoLabel}>공연 기간</div>
        <div className={styles.infoValue}>{date}</div>
      </div>
      <div className={styles.infoRow}>
        <div className={styles.infoLabel}>공연 시간</div>
        <div className={styles.infoValue}>{duration}</div>
      </div>
      <div className={styles.infoRow}>
        <div className={styles.infoLabel}>관람 연령</div>
        <div className={styles.infoValue}>{ageLimit}</div>
      </div>
    </div>
  );
};

export default PerformanceInfoCard;

