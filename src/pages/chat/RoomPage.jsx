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
  disconnectSocket,
} from "../../api/socket";

// ✅ JWT에서 userId 추출
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

  const token = localStorage.getItem("accessToken");
  const payload = token ? parseJwt(token) : null;
  const currentUserId = payload?.userId
    ? Number(payload.userId)
    : payload?.sub
    ? Number(payload.sub)
    : null;

  /* ✅ 채팅방 정보 로드 */
  useEffect(() => {
    const loadRoom = async () => {
      try {
        // 1️⃣ 전체 방 목록에서 현재 방 타입 확인
        const allRooms = await fetchChatRooms();
        const currentRoom = allRooms.find(
          (r) => String(r.roomId) === String(id)
        );

        if (!currentRoom) {
          setRoom(null);
          return;
        }

        // 2️⃣ roomType 기반으로 public / private 자동 분기 호출
        const data = await fetchChatRoom(id, currentRoom.roomType);
        setRoom(data);
      } catch (err) {
        console.error("❌ 채팅방 불러오기 실패:", err);
      }
    };
    loadRoom();
  }, [id]);

  /* ✅ 초기 메시지 로드 */
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

  /* ✅ WebSocket 연결 및 실시간 수신 */
  useEffect(() => {
    const client = connectSocket(() => {
      subscribeRoom(id, (msg) => {
        console.log("📩 새 메시지 수신:", msg);
        setMessages((prev) => {
          const existingIndex = prev.findIndex((m) => {
            if (m.id != null && msg.id != null) {
              return String(m.id) === String(msg.id);
            }
            return false;
          });

          if (existingIndex !== -1) return prev;

          const tempMsgIndex = prev.findIndex((m) => {
            if (m.id && String(m.id).startsWith("temp-")) {
              const mUserId = m.userId || m.user?.userId;
              const msgUserId = msg.userId;
              const mText = m.message || m.contents || "";
              const msgText = msg.message || msg.contents || "";
              return (
                mUserId != null &&
                msgUserId != null &&
                Number(mUserId) === Number(msgUserId) &&
                mText === msgText &&
                mText !== ""
              );
            }
            return false;
          });

          let updated;
          if (tempMsgIndex !== -1) {
            updated = [...prev];
            updated[tempMsgIndex] = msg;
          } else {
            updated = [...prev, msg];
          }

          updated.sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt));
          return updated;
        });
      });
    });
    return () => disconnectSocket(client);
  }, [id]);

  /* ✅ 메시지 변경 시 스크롤 맨 아래로 */
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  /* ✅ 스크롤 시 이전 메시지 로드 */
  const handleScroll = async () => {
    if (!scrollRef.current || !hasMore) return;
    if (scrollRef.current.scrollTop === 0) {
      const nextPage = page + 1;
      try {
        const older = await fetchMessages(id, nextPage);
        if (older.length === 0) setHasMore(false);
        else {
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

  /* ✅ 메시지 전송 */
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

  // ✅ 공연 상세 페이지로 이동하는 핸들러
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
          image={room.thumbnailUrl || "/poster/default.jpg"}
          active={room.isActive}
          visitors={room.visitCount}
          participants={0}
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
