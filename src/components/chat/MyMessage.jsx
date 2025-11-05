import React from 'react';
import styles from './MyMessage.module.css';

const MyMessage = ({ text, time }) => {
  return (
    <div className={styles.message}>
      <div className={styles.messageContent}>
        <span className={styles.messageText}>{text}</span>
        <span className={styles.messageTime}>{time}</span>
      </div>
    </div>
  );
};

export default MyMessage;

