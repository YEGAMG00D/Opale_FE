import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchPublicRoomByPerformance, createChatRoom } from '../../api/chatApi';
import { normalizeExistenceChatRoomResponse } from '../../services/normalizeExistenceChatRoomResponse';
import { normalizeChatRoomCreateRequest } from '../../services/normalizeChatRoomCreateRequest';
import { normalizeChatRoom } from '../../services/normalizeChatRoom';
import styles from './OpenChatSection.module.css';

const OpenChatSection = ({ performanceId, performanceTitle, performanceGenre, performancePoster }) => {
  const navigate = useNavigate();
  const [roomExists, setRoomExists] = useState(false);
  const [roomId, setRoomId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  // 공연 상세 페이지 진입 시 오픈 채팅방 존재 여부 확인
  useEffect(() => {
    const checkPublicRoom = async () => {
      if (!performanceId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetchPublicRoomByPerformance(performanceId);
        const normalized = normalizeExistenceChatRoomResponse(response);
        
        setRoomExists(normalized.exists);
        if (normalized.room) {
          setRoomId(normalized.room.roomId);
        }
      } catch (err) {
        console.error('❌ 오픈 채팅방 확인 실패:', err);
        setRoomExists(false);
      } finally {
        setLoading(false);
      }
    };

    checkPublicRoom();
  }, [performanceId]);

  // 오픈 채팅방으로 이동
  const handleOpenChatClick = () => {
    if (roomId) {
      navigate(`/chat/${roomId}`);
    } else {
      navigate('/chat');
    }
  };

  // 오픈 채팅방 생성
  const handleCreateChatRoom = async () => {
    // 로그인 여부 확인
    const token = localStorage.getItem("accessToken");
    if (!token || token.trim() === "") {
      navigate("/login");
      return;
    }

    if (!performanceId || !performanceTitle || !performanceGenre) {
      console.error('❌ 공연 정보가 부족합니다.');
      return;
    }

    try {
      setCreating(true);
      
      // 채팅방 생성 요청 데이터 준비
      const requestData = {
        title: `${performanceGenre} ${performanceTitle}`,
        description: `${performanceTitle} : 공식 오픈채팅방`,
        roomType: 'PERFORMANCE_PUBLIC',
        performanceId: performanceId,
        thumbnailUrl: performancePoster || null,
        isPublic: true,
        password: '0000',
        creatorId: -1,
      };

      const normalizedRequest = normalizeChatRoomCreateRequest(requestData);
      const response = await createChatRoom(normalizedRequest);
      const normalizedResponse = normalizeChatRoom(response);

      // 생성 성공 후 해당 채팅방으로 이동
      if (normalizedResponse.roomId) {
        setRoomExists(true);
        setRoomId(normalizedResponse.roomId);
        navigate(`/chat/${normalizedResponse.roomId}`);
      }
    } catch (err) {
      console.error('❌ 채팅방 생성 실패:', err);
      // 401 에러(인증 실패)인 경우 로그인 페이지로 이동
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        alert('채팅방 생성에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.openChatSection}>
        <div className={styles.openChatHeader}>
          <h3 className={styles.sectionTitle}>오픈 채팅방</h3>
          <Link to="#" className={styles.reportLink}>제보</Link>
        </div>
        <button className={styles.openChatButton} disabled>
          확인 중...
        </button>
      </div>
    );
  }

  return (
    <div className={styles.openChatSection}>
      <div className={styles.openChatHeader}>
        <h3 className={styles.sectionTitle}>오픈 채팅방</h3>
        <Link to="#" className={styles.reportLink}>제보</Link>
      </div>
      {roomExists ? (
        <button 
          className={styles.openChatButton}
          onClick={handleOpenChatClick}
        >
          오픈채팅방 바로가기
        </button>
      ) : (
        <button 
          className={styles.openChatButton}
          onClick={handleCreateChatRoom}
          disabled={creating}
        >
          {creating ? '생성 중...' : '오픈채팅방 생성하기'}
        </button>
      )}
    </div>
  );
};

export default OpenChatSection;

