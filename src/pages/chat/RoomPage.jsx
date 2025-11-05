import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './RoomPage.module.css';
import { getRoomById } from './mockChatRooms';
import ChatRoomHeader from '../../components/chat/ChatRoomHeader';
import MyMessage from '../../components/chat/MyMessage';
import OtherMessage from '../../components/chat/OtherMessage';

const RoomPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const room = useMemo(() => getRoomById(id), [id]);
  const messagesEndRef = useRef(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const [messages, setMessages] = useState([
    { id: 1, text: '오팔에 어서 오세요 👋', sender: 'system', time: '14:30' },
    { id: 2, text: '안녕하세요! 공연 얘기 나눠요', sender: 'user1', time: '14:31' },
    { id: 3, text: '오늘 위키드 보신 분 있나요?', sender: 'user2', time: '14:32' },
    { id: 4, text: '저요! 1막 넘버가 정말 좋았어요', sender: 'user3', time: '14:33' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser] = useState('me'); // 현재 사용자 ID

  const goToPerformance = () => {
    // 공연 ID를 매핑하는 로직 (실제로는 room 데이터에 performanceId가 있어야 함)
    const performanceIdMap = {
      '1': '1', // 위키드
      '2': '2', // 렌트
      '3': '3', // 물랑루즈
      '4': '4', // 한복입은 남자
      '5': '5', // 킹키부츠
      '6': '6', // 데스노트
    };
    const performanceId = performanceIdMap[id] || '1';
    navigate(`/culture/${performanceId}`);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const key = 'chat_onboarding_dismissed_v1';
    const dismissed = localStorage.getItem(key) === 'true';
    if (!dismissed) {
      setShowOnboarding(true);
    }
  }, []);

  const closeOnboarding = () => setShowOnboarding(false);
  const neverShowOnboarding = () => {
    localStorage.setItem('chat_onboarding_dismissed_v1', 'true');
    setShowOnboarding(false);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      text: newMessage,
      sender: currentUser,
      time: new Date().toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  if (!room) {
    return (
      <div className={styles.container}>존재하지 않는 채팅방입니다.</div>
    );
  }

  return (
    <div className={styles.container}>
      {showOnboarding && (
        <div className={styles.onboardingOverlay} role="dialog" aria-modal="true">
          <div className={styles.onboardingModal}>
            <div className={styles.onboardingBody}>
              <div className={styles.onboardingTitle}>채팅방 안내</div>
              <p className={styles.onboardingText}>
                공연포스터 아이콘을 누르면 해당 공연 페이지로 갈 수 있어요
              </p>
            </div>
            <div className={styles.onboardingFooter}>
              <button className={styles.btnGhost} onClick={neverShowOnboarding}>다시 보지 않기</button>
              <button className={styles.btnPrimary} onClick={closeOnboarding}>닫기</button>
            </div>
          </div>
        </div>
      )}
      <ChatRoomHeader
        title={room.title}
        performanceName={room.performanceName}
        image={room.image}
        active={room.active}
        visitors={room.visitors}
        participants={room.participants}
        creatorNickname={room.creatorNickname}
        onPosterClick={goToPerformance}
      />

      <main className={styles.chatArea}>
        <div className={styles.dayDivider}>오늘</div>
        {messages.map((message) => (
          message.sender === currentUser ? (
            <MyMessage
              key={message.id}
              text={message.text}
              time={message.time}
            />
          ) : (
            <OtherMessage
              key={message.id}
              text={message.text}
              time={message.time}
            />
          )
        ))}
        <div ref={messagesEndRef} />
      </main>

      <form className={styles.inputBar} onSubmit={handleSendMessage}>
        <input 
          className={styles.input} 
          placeholder="메시지를 입력하세요" 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit" className={styles.sendBtn}>전송</button>
      </form>
    </div>
  );
};

export default RoomPage;
