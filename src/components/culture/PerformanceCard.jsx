import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PerformanceCard.module.css';
import wickedPoster from '../../assets/poster/wicked.gif';
import moulinRougePoster from '../../assets/poster/moulin-rouge.gif';
import kinkyBootsPoster from '../../assets/poster/kinky-boots.gif';
import hanbokManPoster from '../../assets/poster/hanbok-man.jpg';
import deathNotePoster from '../../assets/poster/death-note.gif';
import rentPoster from '../../assets/poster/rent.gif';

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

  // 포스터 이미지 매핑
  const posterImages = {
    'wicked': wickedPoster,
    'moulin-rouge': moulinRougePoster,
    'kinky-boots': kinkyBootsPoster,
    'hanbok-man': hanbokManPoster,
    'death-note': deathNotePoster,
    'rent': rentPoster
  };

  // 이미지 URL 처리: URL이면 그대로 사용, 아니면 posterImages에서 찾기
  const getImageSrc = () => {
    if (!image) return wickedPoster;
    // HTTP/HTTPS로 시작하면 URL로 간주
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }
    // 슬래시로 시작하면 상대 경로 URL로 간주
    if (image.startsWith('/')) {
      return image;
    }
    // 그 외는 이미지 이름으로 간주하여 posterImages에서 찾기
    return posterImages[image] || wickedPoster;
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
          src={getImageSrc()}
          alt={`${title} 포스터`}
          onError={(e) => {
            // 이미지 로드 실패 시 기본 이미지로 대체
            if (e.target.src !== wickedPoster) {
              e.target.src = wickedPoster;
            }
          }}
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
          <span className={styles.ratingText}>{rating ? parseFloat(rating).toFixed(1) : '0.0'} ({reviewCount})</span>
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

