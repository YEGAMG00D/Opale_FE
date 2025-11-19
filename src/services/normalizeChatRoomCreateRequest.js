// src/services/normalizeChatRoomCreateRequest.js


export const normalizeChatRoomCreateRequest = (data) => {
  return {
    title: data.title?.trim() || "",
    description: data.description?.trim() || null,
    roomType: data.roomType || null,
    performanceId: data.performanceId?.trim() || null,
    thumbnailUrl: data.thumbnailUrl?.trim() || null,
    isPublic: data.isPublic ?? null,
    password: data.password?.trim() || null,
    creatorId: data.creatorId ?? null,
  };
};

