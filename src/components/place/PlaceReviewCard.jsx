import React, { useState, useEffect } from 'react';
import styles from './PlaceReviewCard.module.css';
import { isPlaceReviewLiked, togglePlaceReviewFavorite } from '../../api/favoriteApi';

const PlaceReviewCard = ({
  id,
  title,
  rating,
  content,
  author,
  date
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // 관심 여부 조회
  useEffect(() => {
    const loadFavoriteStatus = async () => {
      if (!id) return;
      
      try {
        const liked = await isPlaceReviewLiked(id);
        setIsLiked(liked);
      } catch (err) {
        console.error('공연장 리뷰 관심 여부 조회 실패:', err);
        setIsLiked(false);
      }
    };

    loadFavoriteStatus();
  }, [id]);

  // 내용이 4줄 이상인지 확인 (대략적인 계산)
  const shouldShowMoreButton = content.length > 150;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleLike = async () => {
    if (!id) return;
    
    try {
      const result = await togglePlaceReviewFavorite(id);
      setIsLiked(result);
    } catch (err) {
      console.error('공연장 리뷰 관심 토글 실패:', err);
    }
  };

  return (
    <div className={styles.reviewItem}>
      <div className={styles.reviewHeader}>
        <h5 className={styles.reviewTitle}>{title}</h5>
        <div className={styles.reviewMeta}>
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
        <div className={styles.reviewFooterLeft}>
          <button 
            className={`${styles.likeButton} ${isLiked ? styles.liked : ''}`}
            onClick={toggleLike}
          >
            {isLiked ? '♥' : '♡'}
          </button>
          <span className={styles.reviewAuthor}>{author} | {date}</span>
        </div>
      </div>
    </div>
  );
};

export default PlaceReviewCard;

