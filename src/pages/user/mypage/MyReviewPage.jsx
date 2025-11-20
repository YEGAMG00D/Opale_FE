import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMyPerformanceReviews, fetchMyPlaceReviews, deletePerformanceReview, deletePlaceReview } from '../../../api/reviewApi';
import { normalizePerformanceReviews } from '../../../services/normalizePerformanceReview';
import { normalizePlaceReviews } from '../../../services/normalizePlaceReview';
import MyReviewCard from '../../../components/user/MyReviewCard';
import styles from './MyReviewPage.module.css';

const MyReviewPage = () => {
  const navigate = useNavigate();
  const [afterReviews, setAfterReviews] = useState([]); // 공연 후기 (AFTER)
  const [expectationReviews, setExpectationReviews] = useState([]); // 공연 기대평 (EXPECTATION)
  const [placeReviews, setPlaceReviews] = useState([]); // 공연장 리뷰 (PLACE)
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('AFTER'); // 'AFTER', 'EXPECTATION', 'PLACE'

  // 내가 작성한 리뷰 목록 가져오기
  useEffect(() => {
    const loadMyReviews = async () => {
      try {
        setLoading(true);
        // 공연 후기(AFTER)와 기대평(EXPECTATION)을 각각 가져오기
        const [afterData, expectationData, placeRev] = await Promise.all([
          fetchMyPerformanceReviews('AFTER'),
          fetchMyPerformanceReviews('EXPECTATION'),
          fetchMyPlaceReviews()
        ]);
        
        // 디버깅: API 응답 확인
        console.log('📝 API 응답 확인:', { afterData, expectationData, placeRev });
        
        // 공연 후기(AFTER) 처리
        // API 응답: { data: { reviews: [...], totalCount: ... } }
        let afterReviewsArray = [];
        if (Array.isArray(afterData)) {
          afterReviewsArray = afterData;
        } else if (afterData && afterData.reviews && Array.isArray(afterData.reviews)) {
          afterReviewsArray = normalizePerformanceReviews(afterData);
        } else if (afterData && afterData.data && afterData.data.reviews) {
          afterReviewsArray = normalizePerformanceReviews(afterData.data);
        }
        
        // 공연 기대평(EXPECTATION) 처리
        let expectationReviewsArray = [];
        if (Array.isArray(expectationData)) {
          expectationReviewsArray = expectationData;
        } else if (expectationData && expectationData.reviews && Array.isArray(expectationData.reviews)) {
          expectationReviewsArray = normalizePerformanceReviews(expectationData);
        } else if (expectationData && expectationData.data && expectationData.data.reviews) {
          expectationReviewsArray = normalizePerformanceReviews(expectationData.data);
        }
        
        // 공연장 리뷰 처리
        let placeReviewsArray = [];
        if (Array.isArray(placeRev)) {
          placeReviewsArray = placeRev;
        } else if (placeRev && placeRev.reviews && Array.isArray(placeRev.reviews)) {
          placeReviewsArray = normalizePlaceReviews(placeRev);
        } else if (placeRev && placeRev.data && placeRev.data.reviews) {
          placeReviewsArray = normalizePlaceReviews(placeRev.data);
        }
        
        console.log('📝 처리된 배열:', { afterReviewsArray, expectationReviewsArray, placeReviewsArray });
        
        setAfterReviews(afterReviewsArray);
        setExpectationReviews(expectationReviewsArray);
        setPlaceReviews(placeReviewsArray);
      } catch (err) {
        console.error('내 리뷰 목록 조회 실패:', err);
        setAfterReviews([]);
        setExpectationReviews([]);
        setPlaceReviews([]);
      } finally {
        setLoading(false);
      }
    };

    loadMyReviews();
  }, []);

  // 리뷰 삭제 핸들러
  const handleDeleteReview = async (reviewId, reviewType) => {
    if (!window.confirm('정말 이 리뷰를 삭제하시겠습니까?')) {
      return;
    }

    try {
      if (reviewType === 'PLACE') {
        await deletePlaceReview(reviewId);
        setPlaceReviews(prev => prev.filter(r => (r.id || r.reviewId) !== reviewId));
      } else {
        await deletePerformanceReview(reviewId);
        if (reviewType === 'AFTER') {
          setAfterReviews(prev => prev.filter(r => (r.id || r.performanceReviewId || r.reviewId) !== reviewId));
        } else if (reviewType === 'EXPECTATION') {
          setExpectationReviews(prev => prev.filter(r => (r.id || r.performanceReviewId || r.reviewId) !== reviewId));
        }
      }
      alert('리뷰가 삭제되었습니다.');
    } catch (err) {
      console.error('리뷰 삭제 실패:', err);
      alert('리뷰 삭제에 실패했습니다.');
    }
  };

  // 리뷰 수정 핸들러
  const handleEditReview = (review, reviewType) => {
    if (reviewType === 'PLACE') {
      const placeId = review.placeId || review.place?.id;
      if (placeId) {
        navigate(`/place/${placeId}?editReview=${review.id || review.reviewId}`);
      }
    } else {
      const performanceId = review.performanceId || review.performance?.id;
      if (performanceId) {
        navigate(`/culture/${performanceId}?editReview=${review.id || review.performanceReviewId || review.reviewId}`);
      }
    }
  };

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
        <h1 className={styles.title}>작성한 리뷰</h1>
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
                ? '작성한 공연 후기가 없습니다.'
                : activeTab === 'EXPECTATION'
                ? '작성한 공연 기대평이 없습니다.'
                : '작성한 공연장 리뷰가 없습니다.'}
            </p>
            <p className={styles.emptySubText}>
              공연이나 공연장 상세페이지에서 리뷰를 작성해보세요.
            </p>
          </div>
        ) : (
          <div className={styles.reviewList}>
            {filteredReviews.map((review) => (
              <MyReviewCard
                key={`${activeTab}-${review.id || review.performanceReviewId || review.reviewId}`}
                review={review}
                reviewType={activeTab}
                onEdit={handleEditReview}
                onDelete={handleDeleteReview}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReviewPage;

