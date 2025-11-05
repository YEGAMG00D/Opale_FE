import React from 'react';
import styles from './LiveChatCard.module.css';

const LiveChatCard = ({
  id,
  title,
  performanceName,
  image,
  active,
  visitors,
  participants,
  lastMessage,
  lastTime,
  onClick
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(id);
    }
  };

  return (
    <li
      className={styles.liveItem}
      onClick={handleClick}
    >
      <img src={image} alt={performanceName} className={styles.avatar} />
      <div className={styles.liveMeta}>
        <div className={styles.titleRow}>
          <strong className={styles.roomTitle}>{title}</strong>
          <span className={active ? styles.badgeOn : styles.badgeOff}>
            {active ? '활성' : '비활성'}
          </span>
        </div>
        <div className={styles.subMeta}>
          <span className={styles.performance}>{performanceName}</span>
          <span className={styles.dot}>·</span>
          <span className={styles.participants}>{visitors ?? participants}명 방문</span>
        </div>
        <div className={styles.preview}>
          <span className={styles.lastMessage}>{lastMessage}</span>
          <span className={styles.lastTime}>{lastTime}</span>
        </div>
      </div>
    </li>
  );
};

export default LiveChatCard;

