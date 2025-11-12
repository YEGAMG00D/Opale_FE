// src/api/socket.js
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const SOCKET_URL = "http://localhost:8080/ws";
let stompClient = null;

// ✅ WebSocket 연결 (중복 연결 방지)
export const connectSocket = (onConnected) => {
  if (stompClient && stompClient.connected) {
    console.log("⚡ 이미 STOMP 연결 중");
    return stompClient;
  }

  const socket = new SockJS(SOCKET_URL);
  const token = localStorage.getItem("accessToken");
  const cleanToken = token ? token.replace(/^Bearer\s+/i, "").trim() : "";

  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    debug: (str) => console.log("STOMP:", str),
    connectHeaders: {
      Authorization: cleanToken ? `Bearer ${cleanToken}` : "",
    },
    onConnect: () => {
      console.log("✅ WebSocket 연결 성공");
      if (onConnected) onConnected();
    },
    onStompError: (frame) => {
      console.error("❌ STOMP 오류:", frame.headers["message"]);
      console.error("원인:", frame.body);
    },
    onWebSocketClose: () => console.warn("⚠️ WebSocket 연결 종료됨"),
  });

  stompClient.activate();
  return stompClient;
};

// ✅ 방 구독
export const subscribeRoom = (roomId, callback) => {
  if (!stompClient || !stompClient.connected) {
    console.warn("⚠️ STOMP 아직 연결 안됨 (subscribeRoom 무시)");
    return;
  }

  const sub = stompClient.subscribe(`/topic/rooms/${roomId}`, (message) => {
    try {
      const body = JSON.parse(message.body);
      console.log("📩 수신 메시지:", body);
      callback(body);
    } catch (err) {
      console.error("❌ 수신 메시지 파싱 실패:", err);
    }
  });

  console.log(`📡 구독 성공: /topic/rooms/${roomId}`);
  return sub;
};

// ✅ 메시지 전송
export const sendMessage = (roomId, message, token) => {
  if (!stompClient || !stompClient.connected) {
    console.warn("⚠️ STOMP 연결 안됨, 메시지 전송 불가");
    return;
  }

  const cleanToken = token ? token.replace(/^Bearer\s+/i, "").trim() : "";

  const payload = {
    ...message,
    accessToken: cleanToken,
  };

  console.log("📤 전송 메시지:", payload);
  stompClient.publish({
    destination: "/app/chat/send",
    body: JSON.stringify(payload),
  });
};

// ✅ 연결 해제
export const disconnectSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    console.log("❎ WebSocket 연결 해제");
  }
};
