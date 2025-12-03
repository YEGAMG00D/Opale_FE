// src/services/normalizePerformanceReviewRequest.js

/**
 * 공연 리뷰 작성 요청 DTO 생성
 * @param {Object} formData - 폼 데이터 { title, content, rating, performanceDate, performanceTime, section, row, number, ticketId }
 * @param {String} performanceId - 공연 ID
 * @param {String} reviewType - 리뷰 타입 ('AFTER' | 'EXPECTATION')
 * @param {Number|String} ticketId - 티켓 ID (선택)
 * @returns {Object} - API 요청 DTO
 */
export const normalizePerformanceReviewRequest = (formData, performanceId, reviewType = 'AFTER', ticketId = null) => {
  const dto = {
    title: formData.title || '',
    contents: formData.content || '', // API는 contents를 요구
    reviewType: reviewType,
    performanceId: performanceId,
  };
  
  // 기대평(EXPECTATION)이 아닌 경우에만 rating 추가
  if (reviewType !== 'EXPECTATION') {
    dto.rating = formData.rating ? parseFloat(formData.rating) : 5.0;
  } else if (formData.rating !== undefined && formData.rating !== null) {
    // 기대평인데 rating이 명시적으로 전달된 경우에만 추가 (하위 호환성)
    dto.rating = parseFloat(formData.rating);
  }

  // ticketId가 있으면 추가 (백엔드 필수 필드)
  if (ticketId) {
    dto.ticketId = typeof ticketId === 'string' ? parseInt(ticketId, 10) : ticketId;
  } else if (formData.ticketId) {
    // formData에서 ticketId를 가져올 수도 있음
    dto.ticketId = typeof formData.ticketId === 'string' ? parseInt(formData.ticketId, 10) : formData.ticketId;
  }

  // 티켓 정보가 있으면 추가 (하위 호환성을 위해 유지)
  if (formData.performanceDate) {
    dto.performanceDate = formData.performanceDate;
  }
  if (formData.performanceTime) {
    dto.performanceTime = formData.performanceTime;
  }
  
  // seatFront, seatNumber를 우선 사용 (새로운 형식)
  if (formData.seatFront) {
    dto.seatFront = formData.seatFront;
  }
  if (formData.seatNumber) {
    dto.seatNumber = formData.seatNumber;
  }
  
  // 하위 호환성: section, row, number도 지원
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

