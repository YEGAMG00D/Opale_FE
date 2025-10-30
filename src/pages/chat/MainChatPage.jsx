import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MainChatPage.module.css';
import { chatRooms } from './mockChatRooms';

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
            <li
              key={room.id}
              className={styles.liveItem}
              onClick={() => enterRoom(room.id)}
            >
              <img src={room.image} alt={room.performanceName} className={styles.avatar} />
              <div className={styles.liveMeta}>
                <div className={styles.titleRow}>
                  <strong className={styles.roomTitle}>{room.title}</strong>
                  <span className={room.active ? styles.badgeOn : styles.badgeOff}>
                    {room.active ? '활성' : '비활성'}
                  </span>
                </div>
                <div className={styles.subMeta}>
                  <span className={styles.performance}>{room.performanceName}</span>
                  <span className={styles.dot}>·</span>
                  <span className={styles.participants}>{room.visitors ?? room.participants}명 방문</span>
                </div>
                <div className={styles.preview}>
                  <span className={styles.lastMessage}>{room.lastMessage}</span>
                  <span className={styles.lastTime}>{room.lastTime}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>모든 채팅방</h2>
        <ul className={styles.compactList}>
          {others.map((room) => (
            <li
              key={room.id}
              className={styles.compactItem}
              onClick={() => enterRoom(room.id)}
            >
              <img src={room.image} alt={room.performanceName} className={styles.avatarSmall} />
              <div className={styles.compactMeta}>
                <div className={styles.compactTitle}>{room.title}</div>
                <div className={styles.compactSub}>
                  <span>{room.performanceName}</span>
                  <span className={styles.dot}>·</span>
                  <span>{room.visitors ?? room.participants}명 방문</span>
                  <span className={styles.dot}>·</span>
                  <span className={room.active ? styles.textOn : styles.textOff}>
                    {room.active ? '활성' : '비활성'}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MainChatPage;
