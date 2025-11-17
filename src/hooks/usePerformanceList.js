// src/hooks/usePerformanceList.js

import { useEffect, useState, useRef, useCallback } from "react";
import { fetchPerformanceList } from "../api/performanceApi";
import { normalizePerformance } from "../services/normalizePerformance";

export const usePerformanceList = (initialParams = {}) => {
  const [performances, setPerformances] = useState([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);

  const observerRef = useRef(null);

  /** 🔥 페이지별 공연 호출 */
  const load = useCallback(async () => {
    if (loading || !hasNext) return;
    setLoading(true);

    try {
      const params = {
        ...initialParams,
        page,
        size: 20,
      };

      const res = await fetchPerformanceList(params);

      const list = res.performances.map(normalizePerformance);

      setPerformances((prev) => [...prev, ...list]);
      setHasNext(res.hasNext);
    } catch (e) {
      console.error("❌ 공연 목록 호출 실패:", e);
    } finally {
      setLoading(false);
    }
  }, [page, hasNext, loading, initialParams]);

  useEffect(() => {
    load();
  }, [page]);

  /** 🔥 무한스크롤 감시 */
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
