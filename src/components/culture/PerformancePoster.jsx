import React from 'react';
import styles from './PerformancePoster.module.css';

const PerformancePoster = ({ imageUrl, isFavorite, onFavoriteToggle }) => {
  return (
    <div className={styles.mainPoster}>
      <img
        className={styles.mainPosterImg}
        src={imageUrl}
        alt="공연 포스터"
      />
      <div className={styles.posterGradient}></div>
      <button className={styles.favoriteButton} onClick={onFavoriteToggle}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill={isFavorite ? "#FF69B4" : "none"} stroke={isFavorite ? "#FF69B4" : "#999999"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      </button>
    </div>
  );
};

export default PerformancePoster;

