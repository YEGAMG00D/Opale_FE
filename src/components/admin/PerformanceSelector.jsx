import React, { useMemo, useCallback } from "react";
import { usePerformanceList } from "../../hooks/usePerformanceList";
import styles from "./PerformanceSelector.module.css";

const PerformanceSelector = ({ searchQuery, onSearchChange, selectedPerformance, onSelectPerformance }) => {
  // 검색어를 메모이제이션하여 불필요한 재렌더링 방지
  // trim() 결과가 같으면 같은 참조를 유지하도록 처리
  const trimmedKeyword = useMemo(() => {
    const trimmed = searchQuery.trim();
    return trimmed || null;
  }, [searchQuery]);

  // params 객체를 메모이제이션하여 usePerformanceList의 의존성 체크가 정확히 작동하도록 함
  // keyword가 변경될 때만 새로운 객체 생성
  const listParams = useMemo(() => ({
    keyword: trimmedKeyword,
    sortType: "인기",
  }), [trimmedKeyword]);

  const { performances, sentinelRef, loading: loadingPerformances } = usePerformanceList(listParams);

  // 공연 선택 핸들러 - 이벤트 전파 방지 및 안정적인 상태 업데이트
  const handlePerformanceClick = useCallback((performance, e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    onSelectPerformance(performance);
  }, [onSelectPerformance]);

  return (
    <div className={styles.searchSection}>
      <div className={styles.searchHeader}>
        <h2 className={styles.sectionTitle}>공연 선택</h2>
      </div>
      
      <div className={styles.searchInputWrapper}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="공연명으로 검색하세요..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* 공연 목록 */}
      <div className={styles.performanceList}>
        {loadingPerformances && <div className={styles.loading}>로딩 중...</div>}
        {!loadingPerformances && performances.length === 0 && (
          <div className={styles.emptyMessage}>검색 결과가 없습니다.</div>
        )}
        {performances.map((performance) => (
          <div
            key={performance.id}
            className={`${styles.performanceItem} ${
              selectedPerformance?.id === performance.id ? styles.selected : ""
            }`}
            onClick={(e) => handlePerformanceClick(performance, e)}
          >
            <div className={styles.performanceInfo}>
              <div className={styles.performanceTitle}>{performance.title}</div>
              <div className={styles.performanceVenue}>{performance.venue}</div>
              <div className={styles.performanceDate}>
                {performance.startDate} ~ {performance.endDate}
              </div>
            </div>
          </div>
        ))}
        <div ref={sentinelRef} style={{ height: 20 }} />
      </div>
    </div>
  );
};

export default PerformanceSelector;

