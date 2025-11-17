// src/services/normalizePerformanceBooking.js

/**
 * 공연 예매 정보 API 응답을 정제하는 함수
 * 
 * @param {Object} data - API 응답 데이터
 * @returns {Object} 정제된 예매 정보
 */
export const normalizePerformanceBooking = (data) => {
  if (!data) {
    return {
      price: null,
      discountImages: [],
      seatImages: [],
      castingImages: [],
      noticeImages: [],
      otherImages: [],
    };
  }

  return {
    price: data.price || null,
    discountImages: Array.isArray(data.discountImages) ? data.discountImages : [],
    seatImages: Array.isArray(data.seatImages) ? data.seatImages : [],
    castingImages: Array.isArray(data.castingImages) ? data.castingImages : [],
    noticeImages: Array.isArray(data.noticeImages) ? data.noticeImages : [],
    otherImages: Array.isArray(data.otherImages) ? data.otherImages : [],
  };
};

