import React from 'react';
import styles from './ChatRoomHeader.module.css';

const ChatRoomHeader = ({
  title,
  performanceName,
  image,
  active,
  visitors,
  participants,
  creatorNickname,
  onPosterClick
}) => {
  return (
    <header className={styles.header}>
      <button 
        onClick={onPosterClick}
        className={styles.thumbButton}
        aria-label={`${performanceName} 공연 상세 페이지로 이동`}
      >
        <img src={image} alt={performanceName} className={styles.thumb} />
      </button>
      <div className={styles.headerMeta}>
        <div className={styles.headerTop}>
          <strong className={styles.roomTitle}>{title}</strong>
          <span className={active ? styles.badgeOn : styles.badgeOff}>
            {active ? '활성' : '비활성'}
          </span>
        </div>
        <div className={styles.headerSub}>
          <span>{performanceName}</span>
          <span className={styles.dot}>·</span>
          <span>{visitors ?? participants}명 방문</span>
          <span className={styles.dot}>·</span>
          <span>개설자 {creatorNickname}</span>
        </div>
      </div>
    </header>
  );
};

export default ChatRoomHeader;

