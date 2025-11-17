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
  onClick
}) => {
  return (
    <div className={styles.card} onClick={() => onClick?.(id)}>
      {/* 포스터 */}
      <div className={styles.posterWrapper}>
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
          <span className={styles.rating}>{rating.toFixed(1)}</span>
          <span className={styles.count}>({reviewCount})</span>
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
