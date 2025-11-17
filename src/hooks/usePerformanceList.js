// src/hooks/usePerformanceList.js

import { useEffect, useState, useRef, useCallback } from "react";
import { fetchPerformanceList } from "../api/performanceApi";
import { normalizePerformance } from "../services/normalizePerformance";

export const usePerformanceList = (initialParams = {}) => {
  const [performances, setPerformances] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);

  const observerRef = useRef(null);
  const activeRequestId = useRef(0);
  const paramsRef = useRef(initialParams);

  /** ⭐ params 변경 감지 */
  useEffect(() => {
    paramsRef.current = initialParams;

    // 초기화
    setPerformances([]);
    setHasNext(true);
    setPage(1);
    activeRequestId.current++;

  }, [initialParams.genre, initialParams.sortType, initialParams.keyword, initialParams.area]);

  /** ⭐ 리스트 로드 */
  const load = useCallback(async () => {
    if (loading || !hasNext) return;

    const reqId = ++activeRequestId.current;

    setLoading(true);
    try {
      const dto = {
        ...paramsRef.current,
        page,
        size: 20,
      };

      const res = await fetchPerformanceList(dto);

      // 최신 요청만 반영
      if (reqId !== activeRequestId.current) return;

      const list = res.performances.map(normalizePerformance);

      if (page === 1) {
        setPerformances(list);
      } else {
        setPerformances((prev) => [...prev, ...list]);
      }

      setHasNext(res.hasNext);
    } catch (e) {
      console.error("❌ 공연 목록 호출 실패:", e);
    } finally {
      setLoading(false);
    }
  }, [page, hasNext, loading]);

  /** ⭐ page 변경될 때만 API 호출 */
  useEffect(() => {
    load();
  }, [page, load]);

  /** ⭐ 무한스크롤 */
  const sentinelRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNext) {
          setPage((p) => p + 1);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, hasNext]
  );

  return { performances, sentinelRef, loading };
};
