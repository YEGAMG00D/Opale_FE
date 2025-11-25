import React, { useState, useEffect } from 'react';
import styles from './DiscountCard.module.css';

const DiscountCard = ({
  title,
  venue,
  imageUrl,
  saleType,
  discountPercent,
  discountPrice,
  dateRange,
  link,
  discountEndDatetime,
  onClick
}) => {
  const [timeRemaining, setTimeRemaining] = useState(null);

  // 할인 종료 시간 타이머
  useEffect(() => {
    if (!discountEndDatetime) {
      setTimeRemaining(null);
      return;
    }

    const updateTimer = () => {
      const now = new Date();
      const endTime = new Date(discountEndDatetime);
      const diff = endTime - now;

      if (diff <= 0) {
        setTimeRemaining('할인 종료');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeRemaining(`D-${days} ${hours}시간 ${minutes}분 ${seconds}초`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours}시간 ${minutes}분 ${seconds}초`);
      } else if (minutes > 0) {
        setTimeRemaining(`${minutes}분 ${seconds}초`);
      } else {
        setTimeRemaining(`${seconds}초`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [discountEndDatetime]);

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

        {timeRemaining && (
          <div className={styles.timer}>
            ⏰ {timeRemaining}
          </div>
        )}

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

