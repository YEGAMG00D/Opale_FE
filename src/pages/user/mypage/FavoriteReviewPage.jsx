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
        
        // API 응답을 정규화하기 위해 { reviews: [...] } 형태로 변환
        let reviewsToNormalize = null;
        let rawReviewsArray = []; // 원본 리뷰 배열 저장
        
        if (Array.isArray(perfReviewsData)) {
          // 배열인 경우 { reviews: [...] } 형태로 감싸기
          rawReviewsArray = perfReviewsData;
          reviewsToNormalize = { reviews: perfReviewsData };
        } else if (perfReviewsData && perfReviewsData.reviews && Array.isArray(perfReviewsData.reviews)) {
          // { reviews: [...] } 형태
          rawReviewsArray = perfReviewsData.reviews;
          reviewsToNormalize = perfReviewsData;
        } else if (perfReviewsData && perfReviewsData.data) {
          // { data: { reviews: [...] } } 또는 { data: [...] } 형태
          if (Array.isArray(perfReviewsData.data)) {
            rawReviewsArray = perfReviewsData.data;
            reviewsToNormalize = { reviews: perfReviewsData.data };
          } else if (perfReviewsData.data.reviews && Array.isArray(perfReviewsData.data.reviews)) {
            rawReviewsArray = perfReviewsData.data.reviews;
            reviewsToNormalize = perfReviewsData.data;
          }
        }
        
        // 원본 리뷰의 reviewType 확인 (상세 로그)
        if (rawReviewsArray.length > 0) {
          console.log('📝 원본 리뷰 reviewType 확인 (상세):');
          rawReviewsArray.forEach((r, index) => {
            console.log(`  [${index}] 리뷰 ID: ${r.performanceReviewId}, 제목: ${r.title}`);
            console.log(`    - reviewType 원본 값:`, r.reviewType);
            console.log(`    - reviewType 타입:`, typeof r.reviewType);
            console.log(`    - reviewType 문자열 변환:`, String(r.reviewType));
            if (typeof r.reviewType === 'object' && r.reviewType !== null) {
              console.log(`    - reviewType 객체 키:`, Object.keys(r.reviewType));
              console.log(`    - reviewType.name:`, r.reviewType.name);
              console.log(`    - reviewType.toString():`, r.reviewType.toString());
            }
          });
        }
        
        // 정규화 후 reviewType으로 분리 (대소문자 구분 없이)
        if (reviewsToNormalize) {
          console.log('📝 정규화 전 원본 데이터:', reviewsToNormalize);
          const normalized = normalizePerformanceReviews(reviewsToNormalize);
          console.log('📝 정규화 후 데이터 (reviewType 확인):', normalized.map(r => ({
            id: r.id,
            title: r.title,
            reviewType: r.reviewType,
            reviewTypeType: typeof r.reviewType
          })));
          
          afterReviewsArray = normalized.filter(r => {
            // reviewType이 객체일 수도 있으므로 처리
            let typeValue = r.reviewType;
            if (typeof typeValue === 'object' && typeValue !== null) {
              // enum 객체인 경우 name 필드 확인
              typeValue = typeValue.name || typeValue.toString();
            }
            const type = String(typeValue || '').toUpperCase();
            const isAfter = type === 'AFTER';
            console.log(`📝 리뷰 ${r.id} (${r.title}): reviewType=${r.reviewType}, type=${type}, isAfter=${isAfter}`);
            return isAfter;
          });
          
          expectationReviewsArray = normalized.filter(r => {
            // reviewType이 객체일 수도 있으므로 처리
            let typeValue = r.reviewType;
            if (typeof typeValue === 'object' && typeValue !== null) {
              // enum 객체인 경우 name 필드 확인
              typeValue = typeValue.name || typeValue.toString();
            }
            const type = String(typeValue || '').toUpperCase();
            const isExpectation = type === 'EXPECTATION';
            console.log(`📝 리뷰 ${r.id} (${r.title}): reviewType=${r.reviewType}, type=${type}, isExpectation=${isExpectation}`);
            return isExpectation;
          });
        }
        
        // 공연장 리뷰 처리
        let placeReviewsArray = [];
        
        // API 응답을 정규화하기 위해 { reviews: [...] } 형태로 변환
        let placeReviewsToNormalize = null;
        
        if (Array.isArray(placeRevData)) {
          // 배열인 경우 { reviews: [...] } 형태로 감싸기
          placeReviewsToNormalize = { reviews: placeRevData };
        } else if (placeRevData && placeRevData.reviews && Array.isArray(placeRevData.reviews)) {
          // { reviews: [...] } 형태
          placeReviewsToNormalize = placeRevData;
        } else if (placeRevData && placeRevData.data) {
          // { data: { reviews: [...] } } 또는 { data: [...] } 형태
          if (Array.isArray(placeRevData.data)) {
            placeReviewsToNormalize = { reviews: placeRevData.data };
          } else if (placeRevData.data.reviews && Array.isArray(placeRevData.data.reviews)) {
            placeReviewsToNormalize = placeRevData.data;
          }
        }
        
        // 정규화
        if (placeReviewsToNormalize) {
          placeReviewsArray = normalizePlaceReviews(placeReviewsToNormalize);
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

