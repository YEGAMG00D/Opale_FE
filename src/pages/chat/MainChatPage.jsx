import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MainChatPage.module.css";
import axiosInstance from "../../api/axiosInstance";
import LiveChatCard from "../../components/chat/LiveChatCard";
import CompactChatCard from "../../components/chat/CompactChatCard";

const MainChatPage = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [chatRooms, setChatRooms] = useState([]);
  const [error, setError] = useState("");

  // ✅ 채팅방 목록 불러오기
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

  const filteredRooms = chatRooms.filter((r) =>
    r.title.toLowerCase().includes(keyword.toLowerCase())
  );

  const enterRoom = (id) => navigate(`/chat/${id}`);

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
            {filteredRooms.map((room) => (
              <CompactChatCard
                key={room.roomId}
                id={room.roomId}
                title={room.title}
                performanceName={room.performanceTitle}
                image={room.thumbnailUrl}
                active={room.isActive}
                visitors={room.visitCount}
                participants={room.participants}
                onClick={enterRoom}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MainChatPage;
