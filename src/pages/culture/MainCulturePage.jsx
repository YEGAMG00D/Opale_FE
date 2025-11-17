import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./MainCulturePage.module.css";
import { usePerformanceList } from "../../hooks/usePerformanceList";
import PerformanceApiCard from "../../components/cards/PerformanceApiCard";

const MainCulturePage = () => {
  const navigate = useNavigate();
  const searchRef = useRef(null);

  /** 상태값 */
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showOngoingOnly, setShowOngoingOnly] = useState(false);

  /** ⭐ 영어 → 한국어 장르명 매핑 */
  const categoryMapForRequest = {
    musical: "뮤지컬",
    play: "연극",
    popular: "대중음악",
    classical: "서양음악(클래식)",
    traditional: "한국음악(국악)",
  };

  /** API 연동 */
  const { performances, sentinelRef, loading } = usePerformanceList({
    // 🔥 all → null, 나머지는 한국어로 변환하여 백엔드에 전달
    genre:
      selectedCategory === "all"
        ? null
        : categoryMapForRequest[selectedCategory],
    sortType: "인기",
  });

  /** 검색 기능 */
  useEffect(() => {
    if (!searchQuery.trim()) {
      setShowSuggestions(false);
      return;
    }

    const filtered = performances.filter((p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredSuggestions(filtered.slice(0, 5));
    setShowSuggestions(true);
  }, [searchQuery, performances]);

  /** 검색 제출 */
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/culture/search?q=${searchQuery}`);
  };

  /** 진행중 공연 여부 판단 */
  const isOngoing = (item) => {
    if (!item.startDate || !item.endDate) return false;

    const today = new Date();
    const s = new Date(item.startDate);
    const e = new Date(item.endDate);

    return today >= s && today <= e;
  };

  /** 🔥 진행중 필터만 로컬에서 적용 (장르는 백엔드에서 처리됨) */
  const finalList = showOngoingOnly
    ? performances.filter((p) => isOngoing(p))
    : performances;

  /** 카테고리 UI */
  const categories = [
    { id: "all", label: "전체" },
    { id: "musical", label: "뮤지컬" },
    { id: "play", label: "연극" },
    { id: "popular", label: "대중음악" },
    { id: "classical", label: "서양음악(클래식)" },
    { id: "traditional", label: "한국음악(국악)" },
  ];

  return (
    <div className={styles.container}>
      {/* 검색창 */}
      <div className={styles.searchSection} ref={searchRef}>
        <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
          <input
            type="text"
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      {/* 카테고리 + 진행중 체크 */}
      <div className={styles.categorySection}>
        <div className={styles.categoryTabs}>
          {categories.map((c) => (
            <button
              key={c.id}
              className={`${styles.categoryTab} ${
                selectedCategory === c.id ? styles.activeCategory : ""
              }`}
              onClick={() => setSelectedCategory(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className={styles.ongoingFilter}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={showOngoingOnly}
              onChange={(e) => setShowOngoingOnly(e.target.checked)}
              className={styles.checkbox}
            />
            <span className={styles.checkboxText}>진행중인 공연만 보기</span>
          </label>
        </div>
      </div>

      {/* 카드 리스트 */}
      <div className={styles.performanceGrid}>
        {finalList.map((p, index) => {
          return (
            <PerformanceApiCard
              key={p.id + "_" + index}
              {...p}
              onClick={() => navigate(`/culture/${p.id}`)}
            />
          );
        })}
      </div>

      <div ref={sentinelRef} style={{ height: 40 }} />
      {loading && <p>불러오는 중...</p>}
    </div>
  );
};

export default MainCulturePage;
