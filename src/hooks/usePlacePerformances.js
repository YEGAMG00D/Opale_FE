// src/hooks/usePlacePerformances.js

import { useState, useEffect } from "react";
import { fetchPlacePerformances } from "../api/placeApi";
import { normalizePlacePerformances } from "../services/normalizePlacePerformance";

/**
 * 공연장별 공연 목록을 가져오는 커스텀 훅
 * @param {string} placeId - 공연장 ID
 * @returns {Object} { performances, loading, error }
 */
export const usePlacePerformances = (placeId) => {
  const [performances, setPerformances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!placeId) {
      setPerformances([]);
      return;
    }

    const loadPerformances = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchPlacePerformances(placeId);
        const normalized = normalizePlacePerformances(data);
        setPerformances(normalized);
      } catch (err) {
        console.error("❌ 공연장별 공연 목록 조회 실패:", err);
        setError(err.message || "공연 목록을 불러오는 중 오류가 발생했습니다.");
        setPerformances([]);
      } finally {
        setLoading(false);
      }
    };

    loadPerformances();
  }, [placeId]);

  return { performances, loading, error };
};

