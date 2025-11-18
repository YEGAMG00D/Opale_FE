// src/services/normalizePlaceDetail.js

export const normalizePlaceDetail = (item) => {
  return {
    id: item.placeId,
    name: item.name ?? "",
    address: item.address ?? "",
    telno: item.telno ?? "",
    homepage: item.relateurl ?? "",
    openingYear: item.opende ? `${item.opende}년` : "-",
    facilityType: item.fcltychartr ?? "-",
    totalSeats: item.seatscale ?? 0,
    numberOfStages: item.stageCount ?? 0,
    latitude: item.la ?? null,
    longitude: item.lo ?? null,
    rating: item.rating ?? 0,
    reviewCount: item.reviewCount ?? 0,
    // API 응답에 없는 필드들은 빈 배열로 처리
    convenienceFacilities: [],
    parkingFacilities: [],
    stages: [],
  };
};

