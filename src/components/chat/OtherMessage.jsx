import React from 'react';
import styles from './OtherMessage.module.css';

const OtherMessage = ({ text, time, nickname, showNickname }) => {
  return (
    <div className={styles.message}>
      <div className={styles.messageContent}>
        {showNickname && nickname && (
          <span className={styles.nickname}>{nickname}</span>
        )}
        <span className={styles.messageText}>{text}</span>
        <span className={styles.messageTime}>{time}</span>
      </div>
    </div>
  );
};

export default OtherMessage;

