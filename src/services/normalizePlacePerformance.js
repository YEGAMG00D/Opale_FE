// src/services/normalizePlacePerformance.js

/**
 * 공연장별 공연 데이터를 정규화
 * @param {Object} item - API 응답의 공연 객체
 * @returns {Object} - 정규화된 공연 데이터
 */
export const normalizePlacePerformance = (item) => {
  return {
    id: item.performanceId,
    performanceId: item.performanceId,
    title: item.title ?? "",
    poster: item.poster ?? "",
    startDate: item.startDate ?? "",
    endDate: item.endDate ?? "",
    genre: item.genrenm ?? "",
    status: item.prfstate ?? "",
    aiSummary: item.aiSummary ?? "",
    keywords: item.keywords ?? [],
  };
};

/**
 * 공연장별 공연 목록 데이터를 정규화
 * @param {Object} data - API 응답 데이터 (data.items 배열 포함)
 * @returns {Array} - 정규화된 공연 배열
 */
export const normalizePlacePerformances = (data) => {
  if (!data || !data.items || !Array.isArray(data.items)) {
    return [];
  }

  return data.items.map(normalizePlacePerformance);
};

