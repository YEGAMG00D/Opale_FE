import React from 'react';
import styles from './PerformanceTrailer.module.css';

const PerformanceTrailer = ({ englishTitle, title, trailerImage }) => {
  return (
    <div className={`${styles.trailerSection} ${styles[trailerImage]}`}>
      <div className={styles.trailerContent}>
        <div className={styles.trailerTitle}>{title}</div>
        <button className={styles.playButton}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PerformanceTrailer;

