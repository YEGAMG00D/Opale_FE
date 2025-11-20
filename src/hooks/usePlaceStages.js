// src/hooks/usePlaceStages.js

import { useState, useEffect } from "react";
import { fetchPlaceStages } from "../api/placeApi";
import { normalizePlaceStages } from "../services/normalizePlaceStages";

/**
 * 공연장 내 공연관 목록을 가져오는 커스텀 훅
 * @param {string} placeId - 공연장 ID
 * @returns {Object} { stages, loading, error }
 */
export const usePlaceStages = (placeId) => {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!placeId) {
      setStages([]);
      return;
    }

    const loadStages = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchPlaceStages(placeId);
        const normalized = normalizePlaceStages(data);
        setStages(normalized);
      } catch (err) {
        console.error("❌ 공연관 목록 조회 실패:", err);
        setError(err.message || "공연관 정보를 불러오는 중 오류가 발생했습니다.");
        setStages([]);
      } finally {
        setLoading(false);
      }
    };

    loadStages();
  }, [placeId]);

  return { stages, loading, error };
};

