import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PerformanceCard.module.css';

const PerformanceCard = ({
  id,
  title,
  image,
  rating,
  reviewCount,
  date,
  description,
  genre,
  keywords,
  variant = 'default' // 'default' (MainCulturePage) or 'featured' (MainHomePage)
}) => {
  const navigate = useNavigate();

  // 포스터 확장자 매핑
  const posterExt = {
    'wicked': 'gif',
    'moulin-rouge': 'gif',
    'kinky-boots': 'gif',
    'hanbok-man': 'jpg',
    'death-note': 'gif',
    'rent': 'gif'
  };

  const handleCardClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (id) {
      const targetPath = `/culture/${id}`;
      navigate(targetPath, { replace: false });
    }
  };

  return (
    <div 
      className={styles.performanceCard}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick(e);
        }
      }}
    >
      <div className={styles.posterCard}>
        <img
          className={styles.posterImg}
          src={`/poster/${image}.${posterExt[image] || 'jpg'}`}
          alt={`${title} 포스터`}
        />
      </div>
      <div className={styles.cardInfo}>
        {variant === 'featured' && genre && (
          <div className={styles.cardGenre}>{genre}</div>
        )}
        <div className={styles.cardTitle}>{title}</div>
        {variant === 'default' && date && (
          <div className={styles.cardSubtitle}>{date}</div>
        )}
        {variant === 'featured' && description && (
          <div className={styles.cardDescription}>{description}</div>
        )}
        <div className={styles.cardRating}>
          <span className={styles.star}>★</span>
          <span className={styles.ratingText}>{rating} ({reviewCount})</span>
        </div>
        {variant === 'default' && keywords && keywords.length > 0 && (
          <div className={styles.cardKeywords}>
            {keywords.map((keyword, index) => (
              <span key={index} className={styles.keyword}>#{keyword}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceCard;

