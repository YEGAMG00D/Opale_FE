// src/services/normalizePerformanceReview.js

/**
 * 공연 리뷰 API 응답을 UI에 맞게 정규화
 * @param {Object} apiData - API 응답 데이터 (reviews 배열 포함)
 * @returns {Array} - UI에 맞게 변환된 리뷰 배열
 */
export const normalizePerformanceReviews = (apiData) => {
  if (!apiData || !Array.isArray(apiData.reviews)) {
    return [];
  }

  return apiData.reviews.map((review) => {
    // 날짜 포맷팅 (2025-11-12T17:57:53 -> 2025.11.12)
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}.${month}.${day}`;
    };

    return {
      id: review.performanceReviewId,
      performanceReviewId: review.performanceReviewId,
      performanceId: review.performanceId,
      userId: review.userId,
      title: review.title || '',
      content: review.contents || '',
      rating: review.rating || 0,
      reviewType: review.reviewType || 'AFTER',
      author: review.nickname || '익명',
      date: formatDate(review.createdAt || review.updatedAt),
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      // ReviewCard에서 사용하는 필드들 (기대평에는 없을 수 있음)
      performanceDate: '', // API 응답에 없으면 빈 문자열
      seat: '', // API 응답에 없으면 빈 문자열
    };
  });
};

