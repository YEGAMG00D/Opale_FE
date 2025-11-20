// src/services/normalizePlaceFacilities.js

/**
 * 편의시설 필드명을 한국어로 매핑
 */
const facilityNameMap = {
  restaurant: "레스토랑",
  cafe: "카페",
  store: "편의점",
  nolibang: "놀이방",
  suyu: "수유실",
  parkbarrier: "장애시설-주차장",
  restbarrier: "장애시설-화장실",
  runwbarrier: "장애시설-경사로",
  elevbarrier: "장애시설-엘리베이터",
  parkinglot: "주차시설",
};

/**
 * 편의시설 데이터를 정규화하여 편의시설과 주차시설로 분리
 * @param {Object} data - API 응답 데이터
 * @returns {Object} { convenienceFacilities: string[], parkingFacilities: string[] }
 */
export const normalizePlaceFacilities = (data) => {
  const convenienceFacilities = [];
  const parkingFacilities = [];

  // 편의시설 목록 (주차시설 제외)
  const convenienceKeys = [
    "restaurant",
    "cafe",
    "store",
    "nolibang",
    "suyu",
    "parkbarrier",
    "restbarrier",
    "runwbarrier",
    "elevbarrier",
  ];

  // 주차시설 목록
  const parkingKeys = ["parkinglot"];

  // 편의시설 처리
  convenienceKeys.forEach((key) => {
    if (data[key] === true) {
      const koreanName = facilityNameMap[key];
      if (koreanName) {
        convenienceFacilities.push(koreanName);
      }
    }
  });

  // 주차시설 처리
  parkingKeys.forEach((key) => {
    if (data[key] === true) {
      const koreanName = facilityNameMap[key];
      if (koreanName) {
        parkingFacilities.push(koreanName);
      }
    }
  });

  return {
    convenienceFacilities,
    parkingFacilities,
  };
};

