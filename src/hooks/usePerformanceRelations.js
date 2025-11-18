// src/hooks/usePerformanceRelations.js

import { useState, useEffect } from "react";
import { fetchPerformanceRelations } from "../api/performanceApi";
import { normalizePerformanceRelations } from "../services/normalizePerformanceRelations";

/**
 * 공연 예매처 목록을 가져오는 커스텀 훅
 * @param {string} performanceId - 공연 ID
 * @returns {Object} { bookingSites, loading, error }
 */
export const usePerformanceRelations = (performanceId) => {
  const [bookingSites, setBookingSites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!performanceId) {
      setBookingSites([]);
      return;
    }

    const loadRelations = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchPerformanceRelations(performanceId);
        const normalized = normalizePerformanceRelations(data);
        setBookingSites(normalized);
      } catch (err) {
        console.error("❌ 공연 예매처 목록 조회 실패:", err);
        setError(err.message || "예매처 목록을 불러오는 중 오류가 발생했습니다.");
        setBookingSites([]);
      } finally {
        setLoading(false);
      }
    };

    loadRelations();
  }, [performanceId]);

  return { bookingSites, loading, error };
};

