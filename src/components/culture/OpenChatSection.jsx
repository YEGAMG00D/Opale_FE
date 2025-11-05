import React from 'react';
import { Link } from 'react-router-dom';
import styles from './OpenChatSection.module.css';

const OpenChatSection = () => {
  return (
    <div className={styles.openChatSection}>
      <div className={styles.openChatHeader}>
        <h3 className={styles.sectionTitle}>오픈 채팅방</h3>
        <Link to="#" className={styles.reportLink}>제보</Link>
      </div>
      <button className={styles.openChatButton}>
        오픈채팅방 바로가기
      </button>
    </div>
  );
};

export default OpenChatSection;

