// src/services/normalizePlaceStages.js

/**
 * 무대시설 필드명을 한국어로 매핑
 */
const stageFacilityMap = {
  stageorchat: "오케스트라 피트",
  stagepracat: "연습실",
  stagedresat: "분장실",
  stageoutdrat: "야외무대",
};

/**
 * 공연관 데이터를 정규화
 * @param {Object} item - API 응답의 공연관 객체
 * @returns {Object} - 정규화된 공연관 데이터
 */
export const normalizePlaceStage = (item) => {
  // 무대시설 목록 생성 (true인 필드만)
  const stageFacilities = [];
  
  if (item.stageorchat === true) {
    stageFacilities.push(stageFacilityMap.stageorchat);
  }
  if (item.stagepracat === true) {
    stageFacilities.push(stageFacilityMap.stagepracat);
  }
  if (item.stagedresat === true) {
    stageFacilities.push(stageFacilityMap.stagedresat);
  }
  if (item.stageoutdrat === true) {
    stageFacilities.push(stageFacilityMap.stageoutdrat);
  }

  return {
    id: item.stageId,
    stageId: item.stageId,
    name: item.name ?? "",
    seatscale: item.seatscale ?? 0,
    stagearea: item.stagearea ?? null,
    disabledseatscale: item.disabledseatscale ?? 0,
    stageFacilities,
  };
};

/**
 * 공연관 목록 데이터를 정규화
 * @param {Object} data - API 응답 데이터 (data.items 배열 포함)
 * @returns {Array} - 정규화된 공연관 배열
 */
export const normalizePlaceStages = (data) => {
  if (!data || !data.items || !Array.isArray(data.items)) {
    return [];
  }

  return data.items.map(normalizePlaceStage);
};

