import React, { useState } from 'react';
import styles from './ReviewCard.module.css';

const ReviewCard = ({
  id,
  title,
  performanceDate,
  seat,
  rating,
  content,
  author,
  date
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // 내용이 4줄 이상인지 확인 (대략적인 계산)
  // line-height: 1.6, font-size: 14px 기준으로 약 4줄 = 90px 정도
  const shouldShowMoreButton = content.length > 150; // 대략적인 길이 기준

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  return (
    <div className={styles.reviewItem}>
      <div className={styles.reviewHeader}>
        <h5 className={styles.reviewTitle}>{title}</h5>
        <div className={styles.reviewMeta}>
          <span className={styles.reviewDate}>{performanceDate} | {seat}</span>
          <div className={styles.reviewRating}>
            {[...Array(5)].map((_, i) => (
              <span 
                key={i} 
                className={`${styles.star} ${
                  i < Math.floor(rating) ? styles.filled : ''
                } ${
                  i === Math.floor(rating) && rating % 1 !== 0 ? styles.half : ''
                }`}
              >
                ★
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className={styles.reviewContentText}>
        <p className={`${styles.reviewText} ${!isExpanded && shouldShowMoreButton ? styles.reviewTextTruncated : ''}`}>
          {content}
        </p>
        {shouldShowMoreButton && (
          <button 
            className={styles.expandButton}
            onClick={toggleExpand}
          >
            {isExpanded ? '닫기' : '더보기'}
          </button>
        )}
      </div>
      
      <div className={styles.reviewFooter}>
        <button 
          className={`${styles.likeButton} ${isLiked ? styles.liked : ''}`}
          onClick={toggleLike}
        >
          {isLiked ? '♥' : '♡'}
        </button>
        <span className={styles.reviewAuthor}>{author} | {date}</span>
      </div>
    </div>
  );
};

export default ReviewCard;

