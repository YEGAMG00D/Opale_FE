// src/services/normalizePerformanceAutoComplete.js

/**
 * 공연 자동완성 응답 데이터 정규화
 * @param {Array} data - API 응답 데이터 배열
 * @returns {Array} 정규화된 자동완성 데이터 배열
 */
export const normalizePerformanceAutoComplete = (data) => {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map((item) => {
    return {
      performanceId: item.performanceId || item.id || null,
      title: item.title || "",
      placeName: item.placeName || "",
      startDate: item.startDate || null,
      endDate: item.endDate || null,
    };
  });
};

