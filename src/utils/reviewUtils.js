/**
 * 리뷰 데이터 관리 유틸리티
 * 사용자가 작성한 리뷰 데이터 확인
 */

import { fetchMyPerformanceReviews, fetchMyPlaceReviews } from '../api/reviewApi';

/**
 * 사용자가 작성한 리뷰가 있는지 확인
 * @param {string|number} userId - 사용자 ID (선택적, 없으면 현재 로그인한 사용자)
 * @returns {Promise<boolean>} - 리뷰가 있으면 true, 없으면 false
 */
export const hasUserReviews = async (userId = null) => {
  try {
    // 현재 사용자의 리뷰 확인 (서버 API 사용)
    const [performanceReviews, placeReviews] = await Promise.all([
      fetchMyPerformanceReviews(),
      fetchMyPlaceReviews()
    ]);

    // 공연 리뷰 확인
    let hasPerformanceReviews = false;
    if (Array.isArray(performanceReviews)) {
      hasPerformanceReviews = performanceReviews.length > 0;
    } else if (performanceReviews && performanceReviews.reviews && Array.isArray(performanceReviews.reviews)) {
      hasPerformanceReviews = performanceReviews.reviews.length > 0;
    } else if (performanceReviews && performanceReviews.data && performanceReviews.data.reviews) {
      hasPerformanceReviews = performanceReviews.data.reviews.length > 0;
    }

    // 공연장 리뷰 확인
    let hasPlaceReviews = false;
    if (Array.isArray(placeReviews)) {
      hasPlaceReviews = placeReviews.length > 0;
    } else if (placeReviews && placeReviews.reviews && Array.isArray(placeReviews.reviews)) {
      hasPlaceReviews = placeReviews.reviews.length > 0;
    } else if (placeReviews && placeReviews.data && placeReviews.data.reviews) {
      hasPlaceReviews = placeReviews.data.reviews.length > 0;
    }

    return hasPerformanceReviews || hasPlaceReviews;
  } catch (error) {
    // 에러 발생 시 리뷰가 없다고 간주 (새 사용자로 처리)
    console.warn('리뷰 확인 중 오류 발생 (새 사용자로 간주):', error);
    return false;
  }
};

