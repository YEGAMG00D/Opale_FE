import React from 'react';
import styles from './PerformanceDetails.module.css';

const PerformanceDetails = ({ rating, reviewCount, hashtags, genre, description }) => {
  return (
    <div className={styles.detailsSection}>
      <div className={styles.ratingRow}>
        <span className={styles.star}>★</span>
        <span className={styles.ratingText}>{rating} ({reviewCount})</span>
      </div>
      <div className={styles.hashtags}>
        {hashtags.map((tag, index) => (
          <span key={index} className={styles.hashtag}>{tag}</span>
        ))}
      </div>
      <div className={styles.genre}>{genre}</div>
      <div className={styles.description}>{description}</div>
    </div>
  );
};

export default PerformanceDetails;

