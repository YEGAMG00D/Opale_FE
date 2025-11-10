import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import styles from "./RoomPage.module.css";
import ChatRoomHeader from "../../components/chat/ChatRoomHeader";
import MyMessage from "../../components/chat/MyMessage";
import OtherMessage from "../../components/chat/OtherMessage";
import { fetchChatRoom, fetchMessages } from "../../api/chatApi";
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

  /* ✅ 채팅방 정보 */
  useEffect(() => {
    const loadRoom = async () => {
      try {
        const data = await fetchChatRoom(id);
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
          // 중복 체크: id를 문자열로 변환하여 비교 (Long 타입 대응)
          const existingIndex = prev.findIndex((m) => {
            // id 비교 (타입 불일치 방지를 위해 문자열로 변환)
            if (m.id != null && msg.id != null) {
              if (String(m.id) === String(msg.id)) {
                return true;
              }
            }
            return false;
          });

          // 같은 id가 있으면 중복이므로 무시
          if (existingIndex !== -1) {
            console.log("⚠️ 중복 메시지 감지 (id 일치), 무시:", msg);
            return prev;
          }

          // 임시 메시지(temp-로 시작하는 id)와 매칭: 같은 userId, 같은 message 내용이면 임시 메시지를 실제 메시지로 교체
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
            // 임시 메시지를 실제 메시지로 교체
            console.log("🔄 임시 메시지를 실제 메시지로 교체:", msg);
            updated = [...prev];
            updated[tempMsgIndex] = msg;
          } else {
            // 새 메시지 추가
            updated = [...prev, msg];
          }

          // 시간순 정렬
          updated.sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt));

          console.log("✅ 메시지 추가 완료, 총 메시지 수:", updated.length);
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

    // 로컬 반영용 (임시 메시지)
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

  return (
    <div className={styles.container}>
      <ChatRoomHeader
        title={room.title}
        performanceName={room.performanceTitle || "공연 없음"}
        image={room.thumbnailUrl || "/poster/default.jpg"}
        active={room.isActive}
        visitors={room.visitCount}
        participants={0}
        creatorNickname={room.creatorNickname || "익명"}
      />

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
          placeholder="메시지를 입력하세요"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit" className={styles.sendBtn}>
          전송
        </button>
      </form>
    </div>
  );
};

export default RoomPage;
