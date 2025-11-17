import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import styles from "./MainCulturePage.module.css";
import { usePerformanceList } from "../../hooks/usePerformanceList";
import PerformanceApiCard from "../../components/cards/PerformanceApiCard";

const SearchCulturePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchRef = useRef(null);

  // URL에서 검색어 가져오기
  const keywordFromUrl = searchParams.get("q") || "";

  /** 상태값 */
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState(keywordFromUrl);
  const [showOngoingOnly, setShowOngoingOnly] = useState(false);

  /** URL 검색어 변경 시 검색창 업데이트 */
  useEffect(() => {
    const keyword = searchParams.get("q") || "";
    setSearchQuery(keyword);
  }, [searchParams]);

  /** ⭐ 영어 → 한국어 장르명 매핑 */
  const categoryMapForRequest = {
    musical: "뮤지컬",
    play: "연극",
    popular: "대중음악",
    classical: "서양음악(클래식)",
    traditional: "한국음악(국악)",
  };

  /** API 연동 - keyword 포함 */
  const { performances, sentinelRef, loading } = usePerformanceList({
    genre:
      selectedCategory === "all"
        ? null
        : categoryMapForRequest[selectedCategory],
    keyword: keywordFromUrl || null, // 검색어가 있으면 전달, 없으면 null
    sortType: "인기",
  });

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
      {/* 검색 결과 헤더 */}
      <div style={{ padding: "16px 24px 0", marginTop: "0" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#000000", margin: "0 0 8px 0" }}>
          공연 검색 결과
        </h2>
      </div>

      {/* 검색창 */}
      <div className={styles.searchSection} ref={searchRef}>
        <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
          <input
            type="text"
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="공연을 검색하세요"
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

export default SearchCulturePage;
