// src/hooks/usePlaceBasic.js

import { useState, useEffect } from "react";
import { fetchPlaceBasic } from "../api/placeApi";

/**
 * 공연장 기본 정보를 가져오는 커스텀 훅
 * @param {string} placeId - 공연장 ID
 * @returns {Object} { placeInfo, loading, error }
 */
export const usePlaceBasic = (placeId) => {
  const [placeInfo, setPlaceInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!placeId) {
      setPlaceInfo(null);
      return;
    }

    const loadPlaceInfo = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchPlaceBasic(placeId);
        setPlaceInfo(data);
      } catch (err) {
        console.error("❌ 공연장 정보 조회 실패:", err);
        setError(err.message || "공연장 정보를 불러오는 중 오류가 발생했습니다.");
        setPlaceInfo(null);
      } finally {
        setLoading(false);
      }
    };

    loadPlaceInfo();
  }, [placeId]);

  return { placeInfo, loading, error };
};

