import React, { useEffect, useState } from "react";
import styles from "./CompactChatCard.module.css";

const CompactChatCard = ({
  id,
  title,
  performanceName,
  image,
  active,
  visitors, 
  participants,
  lastMessage,
  lastMessageTime,
  currentTime, // 부모에서 전달받은 현재 시간
  onClick,
}) => {
  const [now, setNow] = useState(currentTime || Date.now()); // 현재 시각 갱신용

  // 부모에서 전달받은 currentTime이 변경되면 업데이트
  useEffect(() => {
    if (currentTime) {
      setNow(currentTime);
    }
  }, [currentTime]);

  // 1초마다 업데이트 (더 정확한 실시간 표시)
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClick = () => {
    if (onClick) onClick(id);
  };

  // "5분 전" 같은 상대 시간 계산
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "";
    const diff = (now - new Date(timestamp)) / 1000;
    if (diff < 60) return `${Math.floor(diff)}초 전`;
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
    return `${Math.floor(diff / 86400)}일 전`;
  };

  return (
    <li className={styles.compactItem} onClick={handleClick}>
      <img src={image} alt={performanceName} className={styles.avatarSmall} />

      <div className={styles.compactMeta}>
        {/* ✅ 제목 + 상태 점 */}
        <div className={styles.titleRow}>
          <div className={styles.compactTitle}>{title}</div>
          <span className={active ? styles.statusOn : styles.statusOff}>
            {active ? "●" : "○"}
          </span>
        </div>

        {/* ✅ 공연명 (없을 때도 자리 유지) */}
        <div className={styles.compactSub}>
          <span className={styles.performance}>
            {performanceName || "\u00A0" /* ← 공백 문자로 자리 유지 */}
          </span>
        </div>


        {/* ✅ 최근 메시지 + 시간 */}
        {lastMessage && (
          <div className={styles.lastMessage}>
            <div className={styles.lastText}>
              {lastMessage.length > 40
                ? lastMessage.slice(0, 40) + "…"
                : lastMessage}
            </div>
            <div className={styles.lastTime}>
              {formatTimeAgo(lastMessageTime)}
            </div>
          </div>
        )}
      </div>
    </li>
  );
};

export default CompactChatCard;
