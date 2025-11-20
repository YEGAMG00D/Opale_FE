// src/services/normalizeExistenceChatRoomResponse.js

import { normalizeChatRoom } from "./normalizeChatRoom";

export const normalizeExistenceChatRoomResponse = (response) => {
  return {
    exists: response.exists ?? false,
    room: response.room ? normalizeChatRoom(response.room) : null,
  };
};

