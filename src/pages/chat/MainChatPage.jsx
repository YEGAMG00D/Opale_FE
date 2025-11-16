import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MainChatPage.module.css";
import axiosInstance from "../../api/axiosInstance";
import CompactChatCard from "../../components/chat/CompactChatCard";
import { connectSocket } from "../../api/socket";

const MainChatPage = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [chatRooms, setChatRooms] = useState([]);
  const [error, setError] = useState("");
  const [currentTime, setCurrentTime] = useState(Date.now());

  const subscriptionRef = useRef(null); // ✅ 구독 저장용

  const ICONS = {
    PUBLIC: "🌐",
    GROUP: "👥",
    DM: "💬",
  };

  // 1️⃣ 채팅방 목록 로드
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axiosInstance.get("/chat/rooms");
        if (res.data.success) {
          setChatRooms(res.data.data.rooms);
        } else {
          setError("채팅방 목록을 불러오지 못했습니다.");
        }
      } catch (err) {
        console.error("채팅방 목록 요청 실패:", err);
        if (err.response?.status === 401) {
          setError("로그인이 필요합니다.");
          navigate("/login");
        } else {
          setError("서버 오류가 발생했습니다.");
        }
      }
    };
    fetchRooms();
  }, [navigate]);

  // 2️⃣ WebSocket: 방 목록 업데이트 구독
  useEffect(() => {
    const client = connectSocket(() => {
      // 구독 저장
      subscriptionRef.current = client.subscribe("/topic/rooms", (msg) => {
        const update = JSON.parse(msg.body);

        setChatRooms((prev) =>
          prev.map((room) =>
            room.roomId === update.roomId
              ? {
                  ...room,
                  lastMessage: update.lastMessage,
                  lastMessageTime: update.lastMessageTime,
                  isActive: update.isActive ?? room.isActive,
                }
              : room
          )
        );
      });
    });

    return () => {
      // ❗ 소켓은 끊지 않고, 구독만 해제
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, []);

  // 3️⃣ 현재 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);

  const filteredRooms = chatRooms.filter((r) =>
    r.title?.toLowerCase().includes(keyword.toLowerCase())
  );

  const enterRoom = (id) => navigate(`/chat/${id}`);

  const getRoomIcon = (roomType) => {
    switch (roomType) {
      case "PERFORMANCE_PUBLIC":
        return ICONS.PUBLIC;
      case "PERFORMANCE_GROUP":
        return ICONS.GROUP;
      case "PRIVATE_DM":
        return ICONS.DM;
      default:
        return "💠";
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchBar}>
        <input
          className={styles.searchInput}
          placeholder="채팅방 또는 공연명을 검색"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button className={styles.searchBtn}>🔍</button>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>모든 채팅방</h2>

        {error ? (
          <p className={styles.error}>{error}</p>
        ) : filteredRooms.length === 0 ? (
          <p className={styles.empty}>검색 결과가 없습니다.</p>
        ) : (
          <ul className={styles.compactList}>
            {filteredRooms.map((room) => {
              const icon = getRoomIcon(room.roomType);

              return (
                <CompactChatCard
                  key={room.roomId}
                  id={room.roomId}
                  title={`${room.title} ${icon}`}
                  performanceName={room.performanceTitle}
                  image={room.thumbnailUrl}
                  active={room.isActive}
                  visitors={room.visitCount}
                  participants={room.participantCount}
                  lastMessage={room.lastMessage}
                  lastMessageTime={room.lastMessageTime}
                  currentTime={currentTime}
                  onClick={enterRoom}
                />
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MainChatPage;
