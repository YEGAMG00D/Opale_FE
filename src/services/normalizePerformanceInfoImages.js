// src/services/normalizePerformanceInfoImages.js

/**
 * 공연 소개 이미지 목록 API 응답을 정제하는 함수
 * 
 * @param {Object} data - API 응답 데이터 { items: [{ imageUrl, orderIndex }] }
 * @returns {Array} 정제된 이미지 목록 (orderIndex 순서대로 정렬)
 */
export const normalizePerformanceInfoImages = (data) => {
  if (!data || !data.items || !Array.isArray(data.items)) {
    return [];
  }

  // orderIndex 순서대로 정렬
  return data.items
    .map((item) => ({
      imageUrl: item.imageUrl || "",
      orderIndex: item.orderIndex || 0,
    }))
    .sort((a, b) => a.orderIndex - b.orderIndex); // orderIndex 오름차순 정렬
};

