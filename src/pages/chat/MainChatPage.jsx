import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MainChatPage.module.css";
import CompactChatCard from "../../components/chat/CompactChatCard";
import { connectSocket } from "../../api/socket";
import { searchChatRooms } from "../../api/chatApi";
import { normalizeChatRoom } from "../../services/normalizeChatRoom";

const MainChatPage = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState(""); // 실제 검색에 사용할 키워드
  const [chatRooms, setChatRooms] = useState([]);
  const [error, setError] = useState("");
  const [currentTime, setCurrentTime] = useState(Date.now());

  const subscriptionRef = useRef(null); // ✅ 구독 저장용

  const ICONS = {
    PUBLIC: "🌐",
    GROUP: "👥",
    DM: "💬",
  };

  // 1️⃣ 채팅방 목록 로드 및 검색
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setError("");
        const dto = {
          roomType: null,
          performanceId: null,
          keyword: searchKeyword.trim() || null,
        };
        
        const rooms = await searchChatRooms(dto);
        const normalizedRooms = rooms.map(normalizeChatRoom);
        setChatRooms(normalizedRooms);
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
  }, [searchKeyword, navigate]);

  // 2️⃣ WebSocket: 방 목록 업데이트 구독
  useEffect(() => {
    const client = connectSocket((connectedClient) => {
      // 구독 저장 - 콜백에서 클라이언트를 인자로 받아 사용
      if (connectedClient && connectedClient.connected) {
        subscriptionRef.current = connectedClient.subscribe("/topic/rooms", (msg) => {
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
      }
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

  // 검색은 서버에서 처리하므로 클라이언트 필터링 불필요
  const filteredRooms = chatRooms;

  const enterRoom = (id) => {
    const token = localStorage.getItem("accessToken");
  
    const room = chatRooms.find(r => r.roomId === id);
    if (!room) return;
  
    if (!token) {
      // 1) 로그인 안된 상태
      if (room.roomType !== "PERFORMANCE_PUBLIC") {
        // PUBLIC 외에는 로그인 필요
        return navigate("/login");
      }
    }
  
    // 2) PUBLIC 이거나, 로그인 된 상태
    navigate(`/chat/${id}`);
  };
  

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

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchKeyword(keyword);
  };

  return (
    <div className={styles.container}>
      <form className={styles.searchBar} onSubmit={handleSearch}>
        <input
          className={styles.searchInput}
          placeholder="채팅방 또는 공연명을 검색"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button type="submit" className={styles.searchBtn}>🔍</button>
      </form>

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
