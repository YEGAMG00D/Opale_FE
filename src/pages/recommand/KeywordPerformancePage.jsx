import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { usePerformanceList } from '../../hooks/usePerformanceList';
import PerformanceApiCard from '../../components/cards/PerformanceApiCard';
import { fetchFavoritePerformanceIds, togglePerformanceFavorite } from '../../api/favoriteApi';
import styles from './KeywordPerformancePage.module.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// 이미지 URL 처리 헬퍼 함수
const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  
  // 이미 절대 URL인 경우 그대로 반환
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // 상대 경로인 경우 API base URL과 결합
  if (imageUrl.startsWith('/')) {
    return `${API_BASE_URL}${imageUrl}`;
  }
  
  // 그 외의 경우 그대로 반환 (이미지 이름 등)
  return imageUrl;
};

const KeywordPerformancePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  // 관심 공연 ID 목록 조회
  useEffect(() => {
    const loadFavoriteIds = async () => {
      try {
        const ids = await fetchFavoritePerformanceIds();
        setFavoriteIds(new Set(ids));
      } catch (err) {
        console.error('관심 공연 ID 목록 조회 실패:', err);
        setFavoriteIds(new Set());
      }
    };
    loadFavoriteIds();
  }, []);

  // 관심 토글 핸들러
  const handleFavoriteToggle = async (performanceId) => {
    try {
      const result = await togglePerformanceFavorite(performanceId);
      setFavoriteIds((prev) => {
        const newSet = new Set(prev);
        if (result) {
          newSet.add(performanceId);
        } else {
          newSet.delete(performanceId);
        }
        return newSet;
      });
    } catch (err) {
      console.error('관심 토글 실패:', err);
    }
  };

  // 키워드로 공연 필터링
  const { performances, sentinelRef, loading } = usePerformanceList({
    genre: null,
    keyword: keyword,
    sortType: '인기',
  });

  // 키워드를 가진 공연만 필터링 (keywords 배열에 해당 키워드가 포함된 공연)
  const filteredPerformances = performances.filter((performance) => {
    const keywords = performance.keywords || [];
    return keywords.some((k) => k === keyword || k.toLowerCase().includes(keyword.toLowerCase()));
  });

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>←</button>
        <h2 className={styles.headerTitle}>#{keyword}</h2>
        <div></div>
      </div>

      {/* 공연 목록 */}
      <div className={styles.content}>
        {loading && filteredPerformances.length === 0 ? (
          <div className={styles.loading}>로딩 중...</div>
        ) : filteredPerformances.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>'{keyword}' 키워드와 관련된 공연이 없습니다.</p>
            <p className={styles.emptySubText}>다른 키워드를 검색해보세요.</p>
          </div>
        ) : (
          <div className={styles.performanceGrid}>
            {filteredPerformances.map((performance) => {
              const imageUrl = getImageUrl(
                performance.posterImage || 
                performance.poster || 
                performance.image
              );
              
              return (
                <PerformanceApiCard
                  key={performance.id || performance.performanceId}
                  id={performance.id || performance.performanceId}
                  image={imageUrl}
                  title={performance.title || performance.performanceName}
                  venue={performance.venue || performance.venueName}
                  startDate={performance.startDate || performance.startDateStr}
                  endDate={performance.endDate || performance.endDateStr}
                  rating={performance.rating || performance.averageRating}
                  reviewCount={performance.reviewCount || performance.reviewCount}
                  keywords={performance.keywords || []}
                  genre={performance.genre || performance.category}
                  isFavorite={favoriteIds.has(performance.id || performance.performanceId)}
                  onFavoriteToggle={handleFavoriteToggle}
                  onClick={(id) => navigate(`/culture/${id}`)}
                />
              );
            })}
          </div>
        )}
        <div ref={sentinelRef} style={{ height: '20px' }} />
      </div>
    </div>
  );
};

export default KeywordPerformancePage;

