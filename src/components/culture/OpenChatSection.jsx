import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMainRoomByPerformanceId } from '../../pages/chat/mockChatRooms';
import styles from './OpenChatSection.module.css';

const OpenChatSection = ({ performanceId }) => {
  const navigate = useNavigate();

  const handleOpenChatClick = () => {
    if (performanceId) {
      const mainRoom = getMainRoomByPerformanceId(performanceId);
      if (mainRoom) {
        navigate(`/chat/${mainRoom.id}`);
      } else {
        // 주 채팅방이 없으면 채팅 메인 페이지로 이동
        navigate('/chat');
      }
    } else {
      navigate('/chat');
    }
  };

  return (
    <div className={styles.openChatSection}>
      <div className={styles.openChatHeader}>
        <h3 className={styles.sectionTitle}>오픈 채팅방</h3>
        <Link to="#" className={styles.reportLink}>제보</Link>
      </div>
      <button 
        className={styles.openChatButton}
        onClick={handleOpenChatClick}
      >
        오픈채팅방 바로가기
      </button>
    </div>
  );
};

export default OpenChatSection;

