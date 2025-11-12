import React from 'react';
import styles from './CompactChatCard.module.css';

const CompactChatCard = ({
  id,
  title,
  performanceName,
  image,
  active,
  visitors,
  participants,
  onClick
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(id);
    }
  };

  return (
    <li
      className={styles.compactItem}
      onClick={handleClick}
    >
      <img src={image} alt={performanceName} className={styles.avatarSmall} />
      <div className={styles.compactMeta}>
        <div className={styles.compactTitle}>{title}</div>
        <div className={styles.compactSub}>
          {/* <span>{performanceName}</span>
          <span className={styles.dot}>·</span>
          <span>{visitors ?? participants}명 방문</span> */}
          <span className={styles.dot}>·</span>
          <span className={active ? styles.textOn : styles.textOff}>
            {active ? '활성' : '비활성'}
          </span>
        </div>
      </div>
    </li>
  );
};

export default CompactChatCard;

