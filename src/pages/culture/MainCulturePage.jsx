import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedCategory, setShowOngoingOnly } from "../../store/performanceSlice";

import styles from "./MainCulturePage.module.css";
import { usePerformanceList } from "../../hooks/usePerformanceList";
import PerformanceApiCard from "../../components/cards/PerformanceApiCard";
import { fetchFavoritePerformanceIds, togglePerformanceFavorite } from "../../api/favoriteApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const MainCulturePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /** Redux 상태 */
  const selectedCategory = useSelector((state) => state.performance.selectedCategory);
  const showOngoingOnly = useSelector((state) => state.performance.showOngoingOnly);
  
  /** 로컬 상태 */
  const [searchQuery, setSearchQuery] = useState("");
  const [favoriteIds, setFavoriteIds] = useState(new Set());

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
    // 검색어가 있으면 keyword로 전달
    keyword: searchQuery.trim() || null,
  });

  /** 관심 공연 ID 목록 조회 */
  useEffect(() => {
    const loadFavoriteIds = async () => {
      try {
        const ids = await fetchFavoritePerformanceIds();
        setFavoriteIds(new Set(ids));
      } catch (err) {
        console.error("관심 공연 ID 목록 조회 실패:", err);
        setFavoriteIds(new Set());
      }
    };
    loadFavoriteIds();
  }, []);

  /** 관심 토글 핸들러 */
  const handleFavoriteToggle = async (performanceId) => {
    try {
      const result = await togglePerformanceFavorite(performanceId);
      setFavoriteIds((prev) => {
        const newSet = new Set(prev);
        if (result) {
          newSet.add(performanceId);
        } else {
          newSet.delete(performanceId);
        }
        return newSet;
      });
    } catch (err) {
      console.error("관심 토글 실패:", err);
    }
  };

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
      <div className={styles.searchSection}>
        <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
          <input
            type="text"
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="공연명을 입력하세요"
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
              onClick={() => dispatch(setSelectedCategory(c.id))}
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
              onChange={(e) => dispatch(setShowOngoingOnly(e.target.checked))}
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
              isFavorite={favoriteIds.has(p.id)}
              onFavoriteToggle={handleFavoriteToggle}
              onClick={() => navigate(`/culture/${p.id}`)}
            />
          );
        })}
      </div>

      <div ref={sentinelRef} style={{ height: 40 }} />
      {loading && <LoadingSpinner />}
    </div>
  );
};

export default MainCulturePage;
