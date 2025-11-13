import React, { useMemo, useState } from 'react';
import styles from './PlaceShowHistory.module.css';
import wickedPoster from '../../assets/poster/wicked.gif';
import moulinRougePoster from '../../assets/poster/moulin-rouge.gif';
import rentPoster from '../../assets/poster/rent.gif';

// 더미 데이터: 실제 API 연동 시 placeId로 필터링하세요.
const DUMMY_SHOWS = [
  { id: 101, placeId: 1, title: '위키드', period: '2025.09.01 ~ 2026.01.05', status: '현재', poster: wickedPoster },
  { id: 102, placeId: 1, title: '렌트', period: '2025.05.10 ~ 2025.08.20', status: '과거', poster: rentPoster },
  { id: 103, placeId: 1, title: '물랑루즈', period: '2024.12.01 ~ 2025.03.20', status: '과거', poster: moulinRougePoster },
];

export default function PlaceShowHistory({ placeId = 1 }) {
  const [tab, setTab] = useState('현재'); // '현재' | '과거'

  const shows = useMemo(() => DUMMY_SHOWS.filter(s => s.placeId === placeId && (tab === '현재' ? s.status === '현재' : s.status === '과거')), [placeId, tab]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabs}>
        <button className={tab === '현재' ? `${styles.tab} ${styles.active}` : styles.tab} onClick={() => setTab('현재')}>현재 진행작</button>
        <button className={tab === '과거' ? `${styles.tab} ${styles.active}` : styles.tab} onClick={() => setTab('과거')}>과거 공연이력</button>
      </div>

      {shows.length === 0 ? (
        <div className={styles.empty}>표시할 공연이 없습니다.</div>
      ) : (
        <ul className={styles.grid}>
          {shows.map((show) => (
            <li key={show.id} className={styles.card}>
              <img className={styles.poster} src={show.poster} alt={show.title} />
              <div className={styles.meta}>
                <div className={styles.title}>{show.title}</div>
                <div className={styles.period}>{show.period}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


