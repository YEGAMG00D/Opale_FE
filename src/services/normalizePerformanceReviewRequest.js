// src/services/normalizePerformanceReviewRequest.js

/**
 * 공연 리뷰 작성 요청 DTO 생성
 * @param {Object} formData - 폼 데이터 { title, content, rating, performanceDate, performanceTime, section, row, number }
 * @param {String} performanceId - 공연 ID
 * @param {String} reviewType - 리뷰 타입 ('AFTER' | 'EXPECTATION')
 * @returns {Object} - API 요청 DTO
 */
export const normalizePerformanceReviewRequest = (formData, performanceId, reviewType = 'AFTER') => {
  const dto = {
    title: formData.title || '',
    contents: formData.content || '', // API는 contents를 요구
    rating: formData.rating ? parseFloat(formData.rating) : 5.0,
    reviewType: reviewType,
    performanceId: performanceId,
  };

  // 티켓 정보가 있으면 추가
  if (formData.performanceDate) {
    dto.performanceDate = formData.performanceDate;
  }
  if (formData.performanceTime) {
    dto.performanceTime = formData.performanceTime;
  }
  if (formData.section) {
    dto.section = formData.section;
  }
  if (formData.row) {
    dto.row = formData.row;
  }
  if (formData.number) {
    dto.number = formData.number;
  }

  return dto;
};

