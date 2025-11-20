/**
 * 공연장 리뷰 작성 요청 DTO 생성
 * @param {Object} formData - 폼 데이터 { title, content, rating }
 * @param {String} placeId - 공연장 ID
 * @param {Number} ticketId - 티켓 ID (선택)
 * @returns {Object} - API 요청 DTO
 */
export const normalizePlaceReviewRequest = (formData, placeId, ticketId = null) => {
  const dto = {
    title: formData.title || '',
    contents: formData.content || '', // API는 contents를 요구
    rating: formData.rating ? parseFloat(formData.rating) : 5.0,
    reviewType: 'PLACE', // 공연장 리뷰는 항상 PLACE 타입
    placeId: placeId,
  };

  // 티켓 ID가 있으면 추가 (선택사항)
  if (ticketId) {
    dto.ticketId = ticketId;
  }

  return dto;
};

