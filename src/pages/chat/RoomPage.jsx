import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./RoomPage.module.css";
import ChatRoomHeader from "../../components/chat/ChatRoomHeader";
import MyMessage from "../../components/chat/MyMessage";
import OtherMessage from "../../components/chat/OtherMessage";
import { fetchChatRooms, fetchChatRoom, fetchMessages } from "../../api/chatApi";
import {
  connectSocket,
  subscribeRoom,
  sendMessage as sendSocketMessage,
} from "../../api/socket"; // ❗ disconnectSocket 제거
import defaultPoster from "../../assets/poster/wicked.gif";

// JWT 파싱
const parseJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

const RoomPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const messagesEndRef = useRef(null);
  const scrollRef = useRef(null);

  const subscriptionRef = useRef(null); // ✅ 방 구독 저장용

  const token = localStorage.getItem("accessToken");
  const payload = token ? parseJwt(token) : null;
  const currentUserId = payload?.userId
    ? Number(payload.userId)
    : payload?.sub
    ? Number(payload.sub)
    : null;

  // 1️⃣ 채팅방 정보 불러오기
  useEffect(() => {
    const loadRoom = async () => {
      try {
        const allRooms = await fetchChatRooms();
        const currentRoom = allRooms.find(
          (r) => String(r.roomId) === String(id)
        );

        if (!currentRoom) {
          setRoom(null);
          return;
        }

        const data = await fetchChatRoom(id, currentRoom.roomType);
        setRoom(data);
      } catch (err) {
        console.error("❌ 채팅방 불러오기 실패:", err);
      }
    };
    loadRoom();
  }, [id]);

  // 2️⃣ 기존 메시지 로드
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await fetchMessages(id, 1);
        const sorted = [...data].sort(
          (a, b) => new Date(a.sentAt) - new Date(b.sentAt)
        );
        setMessages(sorted);
        scrollToBottom();
      } catch (err) {
        console.error("❌ 메시지 목록 불러오기 실패:", err);
      }
    };
    loadMessages();
  }, [id]);

  // 3️⃣ WebSocket 연결 및 실시간 메시지 구독
  useEffect(() => {
    const client = connectSocket(() => {
      subscriptionRef.current = subscribeRoom(id, (msg) => {
        setMessages((prev) => {
          const existingIndex = prev.findIndex(
            (m) => m.id != null && msg.id != null && String(m.id) === String(msg.id)
          );
          if (existingIndex !== -1) return prev;

          const tempIndex = prev.findIndex(
            (m) =>
              m.id &&
              String(m.id).startsWith("temp-") &&
              (m.userId || m.user?.userId) === msg.userId &&
              (m.message || m.contents) === (msg.message || msg.contents)
          );

          let updated;
          if (tempIndex !== -1) {
            updated = [...prev];
            updated[tempIndex] = msg;
          } else {
            updated = [...prev, msg];
          }

          updated.sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt));
          return updated;
        });
      });
    });

    return () => {
      // ❗ 소켓 연결은 유지하고 "구독만 해제"
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [id]);

  // 4️⃣ 메시지 입력 스크롤 유지
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 5️⃣ 이전 메시지 불러오기
  const handleScroll = async () => {
    if (!scrollRef.current || !hasMore) return;

    if (scrollRef.current.scrollTop === 0) {
      const nextPage = page + 1;
      try {
        const older = await fetchMessages(id, nextPage);

        if (older.length === 0) {
          setHasMore(false);
        } else {
          const sorted = [...older, ...messages].sort(
            (a, b) => new Date(a.sentAt) - new Date(b.sentAt)
          );
          setMessages(sorted);
          setPage(nextPage);
        }
      } catch (e) {
        console.error("❌ 추가 메시지 로드 실패:", e);
      }
    }
  };

  // 6️⃣ 메시지 전송
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageDto = { roomId: id, message: newMessage };

    sendSocketMessage(id, messageDto, token);

    const tempMsg = {
      id: `temp-${Date.now()}`,
      userId: currentUserId,
      message: newMessage,
      sentAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMsg]);
    setNewMessage("");
  };

  if (!room)
    return <div className={styles.container}>존재하지 않는 채팅방입니다.</div>;

  const isPublicNoLogin =
    !token && room.roomType === "PERFORMANCE_PUBLIC";

  const handlePosterClick = () => {
    if (room.roomType === "PERFORMANCE_PUBLIC" && room.performanceId) {
      navigate(`/culture/${room.performanceId}`);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerWrapper}>
        <ChatRoomHeader
          title={room.title}
          performanceName={room.performanceTitle || "공연 없음"}
          image={room.thumbnailUrl || defaultPoster}
          active={room.isActive}
          visitors={room.visitCount}
          creatorNickname={room.creatorNickname || "익명"}
          onPosterClick={
            room.roomType === "PERFORMANCE_PUBLIC" && room.performanceId
              ? handlePosterClick
              : undefined
          }
        />
      </div>

      <main className={styles.chatArea} ref={scrollRef} onScroll={handleScroll}>
        <div className={styles.dayDivider}>오늘</div>

        {messages.map((m, i) => {
          const senderId = m.userId || m.user?.userId;
          const isMine = Number(senderId) === Number(currentUserId);
          const time = m.sentAt
            ? new Date(m.sentAt).toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "";

          return isMine ? (
            <MyMessage key={m.id || i} text={m.message || m.contents} time={time} />
          ) : (
            <OtherMessage key={m.id || i} text={m.message || m.contents} time={time} />
          );
        })}

        <div ref={messagesEndRef} />
      </main>

      <form className={styles.inputBar} onSubmit={handleSendMessage}>
        <input
          className={styles.input}
          placeholder={
            isPublicNoLogin
              ? "로그인 후 메시지를 입력할 수 있습니다"
              : "메시지를 입력하세요"
          }
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={isPublicNoLogin}
        />
        <button
          type="submit"
          className={styles.sendBtn}
          disabled={isPublicNoLogin}
        >
          전송
        </button>
      </form>
    </div>
  );
};

export default RoomPage;
