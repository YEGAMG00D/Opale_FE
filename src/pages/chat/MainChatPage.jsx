import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MainChatPage.module.css';
import { chatRooms } from './mockChatRooms';
import LiveChatCard from '../../components/chat/LiveChatCard';
import CompactChatCard from '../../components/chat/CompactChatCard';

const MainChatPage = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');

  const top3 = useMemo(() => {
    return [...chatRooms]
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 3);
  }, []);

  const others = useMemo(() => {
    const topIds = new Set(top3.map((r) => r.id));
    return chatRooms
      .filter((r) => !topIds.has(r.id))
      .filter((r) => {
        if (!keyword.trim()) return true;
        const k = keyword.toLowerCase();
        return (
          r.title.toLowerCase().includes(k) ||
          r.performanceName.toLowerCase().includes(k)
        );
      });
  }, [keyword, top3]);

  const enterRoom = (id) => {
    navigate(`/chat/${id}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchBar}> 
        <input
          className={styles.searchInput}
          placeholder="채팅방 또는 공연명을 검색"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button className={styles.searchBtn} onClick={() => {}} aria-label="검색">
          🔍
        </button>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>실시간 인기 채팅 상위 3개</h2>
        <ul className={styles.liveList}>
          {top3.map((room) => (
            <LiveChatCard
              key={room.id}
              id={room.id}
              title={room.title}
              performanceName={room.performanceName}
              image={room.image}
              active={room.active}
              visitors={room.visitors}
              participants={room.participants}
              lastMessage={room.lastMessage}
              lastTime={room.lastTime}
              onClick={enterRoom}
            />
          ))}
        </ul>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>모든 채팅방</h2>
        <ul className={styles.compactList}>
          {others.map((room) => (
            <CompactChatCard
              key={room.id}
              id={room.id}
              title={room.title}
              performanceName={room.performanceName}
              image={room.image}
              active={room.active}
              visitors={room.visitors}
              participants={room.participants}
              onClick={enterRoom}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MainChatPage;
