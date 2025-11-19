// src/services/normalizePlace.js

export const normalizePlace = (item) => {
  return {
    id: item.placeId,
    name: item.name ?? "",
    address: item.address ?? "",
    telno: item.telno ?? "",
    latitude: item.latitude ?? null,
    longitude: item.longitude ?? null,
    stageCount: item.stageCount ?? 0,
    rating: item.rating ?? 0,
    reviewCount: item.reviewCount ?? 0,
    distance: item.distance ?? null, // 거리 (미터 단위)
  };
};

