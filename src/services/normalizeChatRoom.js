// src/services/normalizeChatRoom.js

export const normalizeChatRoom = (item) => {
  return {
    roomId: item.roomId ?? null,
    title: item.title ?? "",
    description: item.description ?? "",
    performanceId: item.performanceId ?? null,
    performanceTitle: item.performanceTitle ?? null,
    roomType: item.roomType ?? null,
    isPublic: item.isPublic ?? false,
    thumbnailUrl: item.thumbnailUrl ?? null,
    visitCount: item.visitCount ?? 0,
    lastMessage: item.lastMessage ?? null,
    lastMessageTime: item.lastMessageTime ?? null,
    isActive: item.isActive ?? true,
    creatorNickname: item.creatorNickname ?? null,
    participantCount: item.participantCount ?? 0, // CompactChatCard에서 사용하는 필드
  };
};

