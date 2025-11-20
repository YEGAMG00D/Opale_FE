import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchFavoritePerformances, togglePerformanceFavorite } from '../../../api/favoriteApi';
import styles from './FavoriteCulturePerformancePage.module.css';

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

const FavoriteCulturePerformancePage = () => {
  const navigate = useNavigate();
  const [favoritePerformances, setFavoritePerformances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all'); // 'all', 'ongoing', 'finished', 'scheduled'

  // 관심 공연 목록 가져오기
  useEffect(() => {
    const loadFavoritePerformances = async () => {
      try {
        setLoading(true);
        const performances = await fetchFavoritePerformances();
        setFavoritePerformances(performances || []);
      } catch (err) {
        console.error('관심 공연 목록 조회 실패:', err);
        setFavoritePerformances([]);
      } finally {
        setLoading(false);
      }
    };

    loadFavoritePerformances();
  }, []);

  // 공연 상태 분류 함수
  const getPerformanceStatus = (performance) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = performance.startDate 
      ? new Date(performance.startDate)
      : performance.startDateStr 
        ? new Date(performance.startDateStr)
        : null;
    
    const endDate = performance.endDate 
      ? new Date(performance.endDate)
      : performance.endDateStr 
        ? new Date(performance.endDateStr)
        : null;

    if (!startDate || !endDate) {
      return 'unknown';
    }

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    if (today < startDate) {
      return 'scheduled'; // 진행 예정
    } else if (today >= startDate && today <= endDate) {
      return 'ongoing'; // 진행중
    } else {
      return 'finished'; // 진행 종료
    }
  };

  // 카테고리별 필터링
  const filteredPerformances = activeCategory === 'all'
    ? favoritePerformances
    : favoritePerformances.filter(perf => getPerformanceStatus(perf) === activeCategory);

  const categoryLabels = {
    all: '전체',
    ongoing: '진행중',
    finished: '진행 종료',
    scheduled: '진행 예정'
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>관심 공연</h1>
      </div>

      {/* 카테고리 탭 */}
      <div className={styles.categoryTabs}>
        {Object.entries(categoryLabels).map(([key, label]) => (
          <button
            key={key}
            className={`${styles.categoryTab} ${activeCategory === key ? styles.active : ''}`}
            onClick={() => setActiveCategory(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 공연 목록 */}
      <div className={styles.content}>
        {loading ? (
          <div className={styles.loading}>로딩 중...</div>
        ) : filteredPerformances.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>
              {activeCategory === 'all' 
                ? '관심 공연이 없습니다.'
                : `${categoryLabels[activeCategory]}인 관심 공연이 없습니다.`}
            </p>
            <p className={styles.emptySubText}>
              공연 상세페이지에서 하트를 눌러 관심 공연을 추가해보세요.
            </p>
          </div>
        ) : (
          <div className={styles.performanceList}>
            {filteredPerformances.map((performance) => (
              <div
                key={performance.id || performance.performanceId}
                className={styles.performanceItem}
                onClick={() => navigate(`/culture/${performance.id || performance.performanceId}`)}
              >
                {/* 포스터 이미지 */}
                <div className={styles.posterContainer}>
                  <img
                    src={getImageUrl(
                      performance.posterImage || 
                      performance.poster || 
                      performance.image
                    ) || 'https://via.placeholder.com/120x160?text=No+Image'}
                    alt={performance.title || performance.performanceName}
                    className={styles.posterImage}
                    onError={(e) => {
                      if (e.target.src !== 'https://via.placeholder.com/120x160?text=No+Image') {
                        e.target.src = 'https://via.placeholder.com/120x160?text=No+Image';
                      }
                    }}
                    loading="lazy"
                  />
                  {/* 하트 버튼 */}
                  <button
                    className={styles.favoriteButton}
                    onClick={async (e) => {
                      e.stopPropagation();
                      const performanceId = performance.id || performance.performanceId;
                      if (!performanceId) return;

                      try {
                        await togglePerformanceFavorite(performanceId);
                        // 관심 해제 후 목록에서 제거
                        setFavoritePerformances(prev => 
                          prev.filter(p => (p.id || p.performanceId) !== performanceId)
                        );
                      } catch (err) {
                        console.error('관심 공연 해제 실패:', err);
                        // 에러 발생 시 사용자에게 알림 (선택사항)
                        alert('관심 공연 해제에 실패했습니다. 다시 시도해주세요.');
                      }
                    }}
                    aria-label="관심 공연 해제"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="#ffb6c1"
                      stroke="#ffb6c1"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </button>
                </div>

                {/* 정보 영역 */}
                <div className={styles.infoContainer}>
                  <h3 className={styles.performanceTitle}>
                    {performance.title || performance.performanceName}
                  </h3>
                  <div className={styles.performanceDate}>
                    {performance.startDate || performance.startDateStr} ~ {performance.endDate || performance.endDateStr}
                  </div>
                  <div className={styles.performanceRating}>
                    <span className={styles.star}>★</span>
                    <span className={styles.ratingValue}>
                      {typeof performance.rating === 'number' 
                        ? performance.rating.toFixed(1) 
                        : parseFloat(performance.rating || performance.averageRating || 0).toFixed(1)}
                    </span>
                    <span className={styles.reviewCount}>
                      ({performance.reviewCount || 0})
                    </span>
                  </div>
                  {performance.keywords && performance.keywords.length > 0 && (
                    <div className={styles.keywords}>
                      {performance.keywords.map((keyword, index) => (
                        <span key={index} className={styles.keyword}>
                          #{keyword}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoriteCulturePerformancePage;
