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
  };
};

