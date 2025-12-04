import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./RoomPage.module.css";
import ChatRoomHeader from "../../components/chat/ChatRoomHeader";
import MyMessage from "../../components/chat/MyMessage";
import OtherMessage from "../../components/chat/OtherMessage";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { fetchChatRoom, fetchMessages } from "../../api/chatApi";
import {
  connectSocket,
  subscribeRoom,
  sendMessage as sendSocketMessage,
} from "../../api/socket"; // ❗ disconnectSocket 제거
import logApi from "../../api/logApi";
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
  const { user } = useSelector((state) => state.user);
  const reduxUserId = user?.userId || user?.id || null;

  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const messagesEndRef = useRef(null);
  const scrollRef = useRef(null);

  const subscriptionRef = useRef(null); // ✅ 방 구독 저장용

  const token = localStorage.getItem("accessToken");
  const payload = token ? parseJwt(token) : null;
  const currentUserId = payload?.userId
    ? Number(payload.userId)
    : payload?.sub
    ? Number(payload.sub)
    : reduxUserId;

  // 1️⃣ 채팅방 정보 불러오기
  useEffect(() => {
    const loadRoom = async () => {
      setIsLoading(true);
      try {
        // 먼저 public endpoint로 시도 (PERFORMANCE_PUBLIC일 가능성)
        let data = null;
        try {
          data = await fetchChatRoom(id, "PERFORMANCE_PUBLIC");
        } catch (publicErr) {
          // public endpoint 실패 시 일반 endpoint로 시도
          try {
            data = await fetchChatRoom(id, null);
          } catch (privateErr) {
            // 둘 다 실패하면 채팅방이 없음
            console.error("❌ 채팅방을 찾을 수 없습니다:", privateErr);
            setRoom(null);
            setIsLoading(false);
            return;
          }
        }
        
        if (data) {
          setRoom(data);
          
          // 채팅방 접속 시 VIEW 로그 기록 (로그인 상태일 때만)
          if (reduxUserId || token) {
            try {
              // 공연 채팅방인 경우
              if (data.roomType === "PERFORMANCE_PUBLIC" || data.roomType === "PERFORMANCE_GROUP") {
                if (data.performanceId) {
                  await logApi.createLog({
                    eventType: "VIEW",
                    targetType: "PERFORMANCE",
                    targetId: String(data.performanceId)
                  });
                }
              }
              // 공연장 채팅방인 경우 (향후 추가 가능)
              // else if (data.roomType === "PLACE_PUBLIC" && data.placeId) {
              //   await logApi.createLog({
              //     eventType: "VIEW",
              //     targetType: "PLACE",
              //     targetId: String(data.placeId)
              //   });
              // }
            } catch (logErr) {
              console.error('로그 기록 실패:', logErr);
            }
          }
        } else {
          setRoom(null);
        }
      } catch (err) {
        console.error("❌ 채팅방 불러오기 실패:", err);
        setRoom(null);
      } finally {
        setIsLoading(false);
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

  // 날짜 포맷팅 함수 (오늘, 어제, 또는 실제 날짜)
  const formatDateLabel = (dateString) => {
    if (!dateString) return "";
    
    const messageDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // 시간 부분 제거하고 날짜만 비교
    messageDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);

    if (messageDate.getTime() === today.getTime()) {
      return "오늘";
    } else if (messageDate.getTime() === yesterday.getTime()) {
      return "어제";
    } else {
      const year = messageDate.getFullYear();
      const month = String(messageDate.getMonth() + 1).padStart(2, "0");
      const day = String(messageDate.getDate()).padStart(2, "0");
      const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
      const weekday = weekdays[messageDate.getDay()];
      return `${year}.${month}.${day}. (${weekday})`;
    }
  };

  // 메시지를 날짜별로 그룹화
  const groupMessagesByDate = () => {
    const grouped = [];
    let currentDateKey = null;
    let currentDateString = null;
    let currentGroup = [];

    messages.forEach((m) => {
      const messageDate = m.sentAt ? new Date(m.sentAt) : (m.createdAt ? new Date(m.createdAt) : new Date());
      messageDate.setHours(0, 0, 0, 0);
      const dateKey = messageDate.getTime();
      const dateString = m.sentAt || m.createdAt;

      if (currentDateKey !== dateKey) {
        // 새로운 날짜 그룹 시작
        if (currentGroup.length > 0) {
          grouped.push({ date: currentDateKey, dateString: currentDateString, messages: currentGroup });
        }
        currentDateKey = dateKey;
        currentDateString = dateString;
        currentGroup = [m];
      } else {
        currentGroup.push(m);
      }
    });

    // 마지막 그룹 추가
    if (currentGroup.length > 0) {
      grouped.push({ date: currentDateKey, dateString: currentDateString, messages: currentGroup });
    }

    return grouped;
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

  if (isLoading) {
    return (
      <div className={styles.container}>
        <LoadingSpinner />
      </div>
    );
  }

  if (!room) {
    return <div className={styles.container}>존재하지 않는 채팅방입니다.</div>;
  }

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
        {groupMessagesByDate().map((group, groupIndex) => {
          const dateLabel = formatDateLabel(
            group.dateString || group.messages[0]?.sentAt || group.messages[0]?.createdAt
          );
          
          return (
            <React.Fragment key={group.date}>
              <div className={styles.dayDivider}>
                <span>{dateLabel}</span>
              </div>
              
              {group.messages.map((m, i) => {
                const globalIndex = messages.findIndex(
                  (msg) => (msg.id && m.id && String(msg.id) === String(m.id)) ||
                           (msg === m)
                );
                
                const senderId = m.userId || m.user?.userId;
                const isMine = Number(senderId) === Number(currentUserId);
                const time = m.sentAt
                  ? new Date(m.sentAt).toLocaleTimeString("ko-KR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "";

                // 닉네임 추출
                const nickname = m.user?.nickname || m.nickname || m.userName || "익명";
                
                // 같은 사용자가 연속으로 보낸 메시지인지 확인
                const prevMessage = i > 0 ? group.messages[i - 1] : null;
                const prevSenderId = prevMessage?.userId || prevMessage?.user?.userId;
                const isSameUser = prevMessage && Number(prevSenderId) === Number(senderId);
                const showNickname = !isMine && (!isSameUser || i === 0);

                return isMine ? (
                  <MyMessage key={m.id || `group-${groupIndex}-${i}`} text={m.message || m.contents} time={time} />
                ) : (
                  <OtherMessage 
                    key={m.id || `group-${groupIndex}-${i}`} 
                    text={m.message || m.contents} 
                    time={time}
                    nickname={nickname}
                    showNickname={showNickname}
                  />
                );
              })}
            </React.Fragment>
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
