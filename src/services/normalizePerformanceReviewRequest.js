// src/services/normalizePerformanceReviewRequest.js

/**
 * 공연 리뷰 작성 요청 DTO 생성
 * @param {Object} formData - 폼 데이터 { title, content, rating }
 * @param {String} performanceId - 공연 ID
 * @param {String} reviewType - 리뷰 타입 ('AFTER' | 'EXPECTATION')
 * @returns {Object} - API 요청 DTO
 */
export const normalizePerformanceReviewRequest = (formData, performanceId, reviewType = 'AFTER') => {
  return {
    title: formData.title || '',
    contents: formData.content || '', // API는 contents를 요구
    rating: formData.rating ? parseFloat(formData.rating) : 5.0,
    reviewType: reviewType,
    performanceId: performanceId,
  };
};

