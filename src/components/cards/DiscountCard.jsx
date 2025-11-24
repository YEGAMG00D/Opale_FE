import React from 'react';
import styles from './DiscountCard.module.css';

const DiscountCard = ({
  title,
  venue,
  imageUrl,
  saleType,
  discountPercent,
  discountPrice,
  area,
  category,
  rating,
  ratingCount,
  dateRange,
  link,
  onClick
}) => {
  const handleClick = () => {
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
    onClick?.();
  };

  return (
    <div className={styles.card} onClick={handleClick}>
      {/* 포스터 */}
      <div className={styles.posterWrapper}>
        {/* 할인 배지 */}
        {discountPercent && (
          <div className={styles.discountBadge}>
            {discountPercent}
          </div>
        )}
        
        {/* 할인 타입 배지 */}
        {saleType && (
          <div className={styles.saleTypeBadge}>
            {saleType}
          </div>
        )}

        <img 
          src={imageUrl || 'https://via.placeholder.com/300x400?text=No+Image'} 
          alt={title} 
          className={styles.poster}
          referrerPolicy="no-referrer"
          onError={(e) => {
            if (e.target.src !== 'https://via.placeholder.com/300x400?text=No+Image') {
              e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
            }
          }}
          loading="lazy"
        />
      </div>

      {/* 정보 */}
      <div className={styles.info}>
        <div className={styles.title}>{title}</div>
        <div className={styles.venue}>{venue}</div>
        
        {dateRange && (
          <div className={styles.date}>{dateRange}</div>
        )}

        {area && (
          <div className={styles.area}>{area}</div>
        )}

        {category && (
          <div className={styles.category}>{category}</div>
        )}

        <div className={styles.ratingRow}>
          <span className={styles.star}>★</span>
          <span className={styles.rating}>
            {typeof rating === 'number' ? rating.toFixed(1) : parseFloat(rating || 0).toFixed(1)}
          </span>
          <span className={styles.count}>({ratingCount || 0})</span>
        </div>

        {discountPrice && (
          <div className={styles.discountPrice}>
            할인가 {discountPrice}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscountCard;

