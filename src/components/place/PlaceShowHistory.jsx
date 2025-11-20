import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PlaceShowHistory.module.css';
import { usePlacePerformances } from '../../hooks/usePlacePerformances';

/**
 * 날짜 문자열을 YYYY.MM.DD 형식으로 변환
 */
const formatDate = (dateString) => {
  if (!dateString) return '';
  return dateString.replace(/-/g, '.');
};

/**
 * 공연 상태를 날짜 기준으로 판단
 * @param {string} startDate - 시작일 (YYYY-MM-DD)
 * @param {string} endDate - 종료일 (YYYY-MM-DD)
 * @returns {string} '현재' | '과거' | '예정'
 */
const getPerformanceStatus = (startDate, endDate) => {
  if (!startDate || !endDate) return '과거';
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  
  if (today < start) {
    return '예정';
  } else if (today >= start && today <= end) {
    return '현재';
  } else {
    return '과거';
  }
};

export default function PlaceShowHistory({ placeId }) {
  const navigate = useNavigate();
  const { performances, loading } = usePlacePerformances(placeId);
  const [tab, setTab] = useState('현재'); // '현재' | '과거' | '예정'

  // 날짜 기준으로 공연 분류
  const categorizedPerformances = useMemo(() => {
    const current = [];
    const past = [];
    const upcoming = [];

    performances.forEach((performance) => {
      const status = getPerformanceStatus(performance.startDate, performance.endDate);
      
      if (status === '현재') {
        current.push(performance);
      } else if (status === '과거') {
        past.push(performance);
      } else if (status === '예정') {
        upcoming.push(performance);
      }
    });

    return { current, past, upcoming };
  }, [performances]);

  // 선택된 탭에 따른 공연 목록
  const shows = useMemo(() => {
    if (tab === '현재') {
      return categorizedPerformances.current;
    } else if (tab === '과거') {
      return categorizedPerformances.past;
    } else {
      return categorizedPerformances.upcoming;
    }
  }, [tab, categorizedPerformances]);

  const handleCardClick = (performanceId) => {
    if (performanceId) {
      navigate(`/culture/${performanceId}`);
    }
  };

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.empty}>불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabs}>
        <button 
          className={tab === '현재' ? `${styles.tab} ${styles.active}` : styles.tab} 
          onClick={() => setTab('현재')}
        >
          현재 진행작
        </button>
        <button 
          className={tab === '과거' ? `${styles.tab} ${styles.active}` : styles.tab} 
          onClick={() => setTab('과거')}
        >
          과거 공연이력
        </button>
        <button 
          className={tab === '예정' ? `${styles.tab} ${styles.active}` : styles.tab} 
          onClick={() => setTab('예정')}
        >
          예정 공연
        </button>
      </div>

      {shows.length === 0 ? (
        <div className={styles.empty}>표시할 공연이 없습니다.</div>
      ) : (
        <ul className={styles.grid}>
          {shows.map((show) => (
            <li 
              key={show.id} 
              className={styles.card}
              onClick={() => handleCardClick(show.id)}
              style={{ cursor: 'pointer' }}
            >
              <img 
                className={styles.poster} 
                src={show.poster || '/assets/default_poster.png'} 
                alt={show.title}
                onError={(e) => {
                  e.target.src = '/assets/default_poster.png';
                }}
              />
              <div className={styles.meta}>
                {show.genre && (
                  <div className={styles.genre}>{show.genre}</div>
                )}
                <div className={styles.title}>{show.title}</div>
                <div className={styles.period}>
                  {formatDate(show.startDate)} ~ {formatDate(show.endDate)}
                </div>
                {show.keywords && show.keywords.length > 0 && (
                  <div className={styles.keywords}>
                    {show.keywords.map((keyword, index) => (
                      <span key={index} className={styles.keyword}>#{keyword}</span>
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


