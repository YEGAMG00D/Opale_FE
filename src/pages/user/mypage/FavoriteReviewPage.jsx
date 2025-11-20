import React, { useState, useEffect } from 'react';
import { fetchFavoritePerformanceReviews, fetchFavoritePlaceReviews } from '../../../api/favoriteApi';
import { normalizePerformanceReviews } from '../../../services/normalizePerformanceReview';
import { normalizePlaceReviews } from '../../../services/normalizePlaceReview';
import FavoriteReviewCard from '../../../components/user/FavoriteReviewCard';
import styles from './FavoriteReviewPage.module.css';

const FavoriteReviewPage = () => {
  const [afterReviews, setAfterReviews] = useState([]); // 공연 후기 (AFTER)
  const [expectationReviews, setExpectationReviews] = useState([]); // 공연 기대평 (EXPECTATION)
  const [placeReviews, setPlaceReviews] = useState([]); // 공연장 리뷰 (PLACE)
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('AFTER'); // 'AFTER', 'EXPECTATION', 'PLACE'

  // 관심 리뷰 목록 가져오기
  useEffect(() => {
    const loadFavoriteReviews = async () => {
      try {
        setLoading(true);
        const [perfReviewsData, placeRevData] = await Promise.all([
          fetchFavoritePerformanceReviews(),
          fetchFavoritePlaceReviews()
        ]);
        
        // 디버깅: API 응답 확인
        console.log('📝 관심 리뷰 API 응답 확인:', { perfReviewsData, placeRevData });
        
        // 공연 리뷰 처리 (AFTER와 EXPECTATION 분리)
        let afterReviewsArray = [];
        let expectationReviewsArray = [];
        
        if (Array.isArray(perfReviewsData)) {
          // 배열인 경우 reviewType으로 분리
          afterReviewsArray = perfReviewsData.filter(r => r.reviewType === 'AFTER');
          expectationReviewsArray = perfReviewsData.filter(r => r.reviewType === 'EXPECTATION');
        } else if (perfReviewsData && perfReviewsData.reviews && Array.isArray(perfReviewsData.reviews)) {
          // { reviews: [...] } 형태
          const normalized = normalizePerformanceReviews(perfReviewsData);
          afterReviewsArray = normalized.filter(r => r.reviewType === 'AFTER');
          expectationReviewsArray = normalized.filter(r => r.reviewType === 'EXPECTATION');
        } else if (perfReviewsData && perfReviewsData.data && perfReviewsData.data.reviews) {
          // { data: { reviews: [...] } } 형태
          const normalized = normalizePerformanceReviews(perfReviewsData.data);
          afterReviewsArray = normalized.filter(r => r.reviewType === 'AFTER');
          expectationReviewsArray = normalized.filter(r => r.reviewType === 'EXPECTATION');
        }
        
        // 공연장 리뷰 처리
        let placeReviewsArray = [];
        if (Array.isArray(placeRevData)) {
          placeReviewsArray = placeRevData;
        } else if (placeRevData && placeRevData.reviews && Array.isArray(placeRevData.reviews)) {
          placeReviewsArray = normalizePlaceReviews(placeRevData);
        } else if (placeRevData && placeRevData.data && placeRevData.data.reviews) {
          placeReviewsArray = normalizePlaceReviews(placeRevData.data);
        }
        
        console.log('📝 처리된 배열:', { afterReviewsArray, expectationReviewsArray, placeReviewsArray });
        
        setAfterReviews(afterReviewsArray);
        setExpectationReviews(expectationReviewsArray);
        setPlaceReviews(placeReviewsArray);
      } catch (err) {
        console.error('관심 리뷰 목록 조회 실패:', err);
        setAfterReviews([]);
        setExpectationReviews([]);
        setPlaceReviews([]);
      } finally {
        setLoading(false);
      }
    };

    loadFavoriteReviews();
  }, []);

  // 탭별 필터링
  const getFilteredReviews = () => {
    if (activeTab === 'AFTER') {
      return afterReviews;
    } else if (activeTab === 'EXPECTATION') {
      return expectationReviews;
    } else if (activeTab === 'PLACE') {
      return placeReviews;
    }
    return [];
  };

  const filteredReviews = getFilteredReviews();
  const totalCount = afterReviews.length + expectationReviews.length + placeReviews.length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>관심 리뷰</h1>
      </div>

      {/* 탭 */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'AFTER' ? styles.active : ''}`}
          onClick={() => setActiveTab('AFTER')}
        >
          공연 후기 ({afterReviews.length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'EXPECTATION' ? styles.active : ''}`}
          onClick={() => setActiveTab('EXPECTATION')}
        >
          공연 기대평 ({expectationReviews.length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'PLACE' ? styles.active : ''}`}
          onClick={() => setActiveTab('PLACE')}
        >
          공연장 리뷰 ({placeReviews.length})
        </button>
      </div>

      {/* 리뷰 목록 */}
      <div className={styles.content}>
        {loading ? (
          <div className={styles.loading}>로딩 중...</div>
        ) : filteredReviews.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>
              {activeTab === 'AFTER'
                ? '관심 공연 후기가 없습니다.'
                : activeTab === 'EXPECTATION'
                ? '관심 공연 기대평이 없습니다.'
                : '관심 공연장 리뷰가 없습니다.'}
            </p>
            <p className={styles.emptySubText}>
              리뷰에 좋아요를 눌러 관심 리뷰를 추가해보세요.
            </p>
          </div>
        ) : (
          <div className={styles.reviewList}>
            {filteredReviews.map((review) => (
              <FavoriteReviewCard
                key={`${activeTab}-${review.id || review.performanceReviewId || review.placeReviewId || review.reviewId}`}
                review={review}
                reviewType={activeTab}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoriteReviewPage;

