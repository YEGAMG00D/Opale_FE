// src/components/cards/PerformanceApiCard.jsx

import React from "react";
import styles from "./PerformanceApiCard.module.css";

const PerformanceApiCard = ({
  id,
  image,
  title,
  venue,
  startDate,
  endDate,
  rating,
  reviewCount,
  keywords,
  aiSummary,
  genre,
  isFavorite = false,
  onFavoriteToggle,
  onClick
}) => {
  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    onFavoriteToggle?.(id);
  };

  return (
    <div className={styles.card} onClick={() => onClick?.(id)}>
      {/* 포스터 */}
      <div className={styles.posterWrapper}>
        {/* ⭐ 포스터 좌측 상단 장르 표시 */}
        {genre && <div className={styles.genreBadge}>{genre}</div>}

        {/* 하트 버튼 */}
        <button 
          className={styles.favoriteButton} 
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? "관심 해제" : "관심 추가"}
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill={isFavorite ? "#FF69B4" : "none"} 
            stroke={isFavorite ? "#FF69B4" : "#FFFFFF"} 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>

        <img src={image} alt={title} className={styles.poster} />
      </div>

      {/* 정보 */}
      <div className={styles.info}>
        <div className={styles.title}>{title}</div>
        <div className={styles.venue}>{venue}</div>

        <div className={styles.date}>
          {startDate} ~ {endDate}
        </div>

        <div className={styles.ratingRow}>
          <span className={styles.star}>★</span>
          <span className={styles.rating}>
            {typeof rating === 'number' ? rating.toFixed(1) : parseFloat(rating || 0).toFixed(1)}
          </span>
          <span className={styles.count}>({reviewCount || 0})</span>
        </div>

        {keywords?.length > 0 && (
          <div className={styles.tags}>
            {keywords.map((k, i) => (
              <span key={i} className={styles.tag}>#{k}</span>
            ))}
          </div>
        )}

        {aiSummary && (
          <p className={styles.summary}>{aiSummary}</p>
        )}
      </div>
    </div>
  );
};

export default PerformanceApiCard;
