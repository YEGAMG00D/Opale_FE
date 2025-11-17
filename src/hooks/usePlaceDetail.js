// src/hooks/usePlaceDetail.js

import { useState, useEffect } from "react";
import { fetchPlaceBasic } from "../api/placeApi";
import { normalizePlaceDetail } from "../services/normalizePlaceDetail";

/**
 * 공연장 기본 정보를 가져오는 커스텀 훅
 * @param {string} placeId - 공연장 ID
 * @returns {Object} { place, loading, error }
 */
export const usePlaceDetail = (placeId) => {
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!placeId) {
      setPlace(null);
      return;
    }

    const loadPlaceData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchPlaceBasic(placeId);
        const normalized = normalizePlaceDetail(data);
        setPlace(normalized);
      } catch (err) {
        console.error("❌ 공연장 기본 정보 조회 실패:", err);
        setError(err.message || "공연장 정보를 불러오는 중 오류가 발생했습니다.");
        setPlace(null);
      } finally {
        setLoading(false);
      }
    };

    loadPlaceData();
  }, [placeId]);

  return { place, loading, error };
};

