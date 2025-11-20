/**
 * 공연 리뷰 단건 응답 DTO를 프론트엔드 형식으로 정제
 * @param {Object} apiResponse - API 응답 (PerformanceReviewResponseDto)
 * @returns {Object} - 프론트엔드에서 사용할 수 있는 형식
 */
export const normalizePerformanceReviewResponse = (apiResponse) => {
  if (!apiResponse) return null;

  return {
    id: apiResponse.performanceReviewId,
    performanceReviewId: apiResponse.performanceReviewId,
    performanceId: apiResponse.performanceId,
    performanceTitle: apiResponse.performanceTitle || '',
    poster: apiResponse.poster || '',
    userId: apiResponse.userId,
    nickname: apiResponse.nickname || '익명',
    title: apiResponse.title || '',
    content: apiResponse.contents || apiResponse.content || '',
    contents: apiResponse.contents || '',
    rating: apiResponse.rating || 0,
    reviewType: apiResponse.reviewType || 'AFTER',
    performanceDate: apiResponse.performanceDate,
    seatInfo: apiResponse.seatInfo || '',
    createdAt: apiResponse.createdAt,
    updatedAt: apiResponse.updatedAt
  };
};

