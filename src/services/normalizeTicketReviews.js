/**
 * 티켓 리뷰 번들 API 응답을 프론트엔드 형식으로 정제
 */

/**
 * 티켓 리뷰 번들 API 응답을 프론트엔드 형식으로 변환
 * @param {Object} apiResponse - API 응답 (TicketReviewBundleResponseDto)
 * @param {number} apiResponse.ticketId - 티켓 ID
 * @param {Object|null} apiResponse.performanceReview - 공연 리뷰 (PerformanceReviewResponseDto 또는 null)
 * @param {Object|null} apiResponse.placeReview - 공연장 리뷰 (PlaceReviewResponseDto 또는 null)
 * @returns {Object} - 정제된 티켓 리뷰 데이터
 */
export const normalizeTicketReviews = (apiResponse) => {
  if (!apiResponse) {
    return {
      ticketId: null,
      performanceReview: null,
      placeReview: null,
      hasPerformanceReview: false,
      hasPlaceReview: false
    };
  }

  return {
    ticketId: apiResponse.ticketId || null,
    performanceReview: apiResponse.performanceReview || null,
    placeReview: apiResponse.placeReview || null,
    hasPerformanceReview: !!apiResponse.performanceReview,
    hasPlaceReview: !!apiResponse.placeReview
  };
};

